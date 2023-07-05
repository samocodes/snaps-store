<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import type { Items } from "$lib/types";

  import Navbar from "$lib/ui/Navbar.svelte";
  import MediaCard from "$lib/components/MediaCard.svelte";
  import UploadFileDialog from "$lib/components/UploadFileDialog.svelte";

  import { groupDates, mediaTime } from "$lib/helpers/time";
  import { groupItemsByDate } from "$lib/helpers/grouping.js";
  import { BUCKET_NAME } from "$lib/constants.js";

  export let data;

  let { supabase } = data;
  $: ({ supabase } = data);

  const itemsStore = writable<Items[]>([]);

  onMount(async () => {
    await fileRetrieveFromBucket();
  });

  const fileRetrieveFromBucket = async () => {
    if (!data.session) return;

    const storage = supabase.storage.from(BUCKET_NAME);
    let { data: files, error: filesError } = await storage.list(
      data.session.user.id
    );

    if (filesError) console.error(filesError);
    if (files) {
      // Filters empty folders if exists
      const items = files
        .filter((d) => d.name !== ".emptyFolderPlaceholder")
        .map((file) => ({
          name: file.name,
          uploadedAt: new Date(file.updated_at),
          id: file.id,
        }));

      if (!items.length) return;
      const { data: signedUrls, error: signedUrlsError } =
        await storage.createSignedUrls(
          items.map((d) => data.session!.user.id + "/" + d.name),
          60
        );

      if (signedUrlsError) {
        console.error(signedUrlsError);
      } else if (signedUrls) {
        itemsStore.update(() => {
          const updatedItems: Items[] = signedUrls.map(({ signedUrl }, i) => ({
            id: items[i].id,
            uploadedAt: items[i].uploadedAt,
            url: signedUrl,
          }));

          const uniqueItems: Items[] = Array.from(
            new Map(updatedItems.map((item) => [item.id, item]))
          ).map(([_, item]) => item);

          return uniqueItems;
        });
      }
    }
  };

  async function newlyUploaded(event: CustomEvent) {
    const files = event.detail.files as File[];

    if (files) {
      await fileRetrieveFromBucket();
    }
  }

  let showModal: boolean = false;

  const handleRevealDialog = (event: CustomEvent) => {
    if (event.detail.value == "BUTTON_CLICKED") {
      showModal = !showModal;
    }
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSwitch = async () => {
    await supabase.auth.signOut();

    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };
</script>

{#if data.session == null}
  <Navbar email={""} on:login={handleLogin} />
  <div class="flex">
    <span
      class="font-comforta text-3xl mt-2 text-white font-bold text-center m-auto"
      >You must need to login</span
    >
  </div>
{:else if data.session !== null}
  <Navbar
    email={data.session.user.email ?? data.session.user.user_metadata.name}
    on:login={handleLogin}
    on:logout={handleLogout}
    on:switch={handleSwitch}
    on:reveal-dialog={handleRevealDialog}
  />

  <main class="p-2">
    {#if $itemsStore.length > 0}
      <div
        class="flex flex-col items-start w-full overflow-y-scroll max-h-[85vh] hide-scroll-bar gap-5"
      >
        {#each groupItemsByDate($itemsStore) as { date, items }}
          <div class="relative w-full">
            <div
              class="z-10 sticky backdrop-blur-3xl p-3 rounded-xl top-0 mb-5 flex flex-row items-center gap-5"
            >
              <h1
                class="text-2xl text-[#fca311] font-bold tracking-wide font-comforta"
              >
                {groupDates(date.getDay() - 1, date.getDate(), date.getMonth())}
              </h1>

              <div class=" flex-1 h-px bg-[#fca311] bg-opacity-40 rounded-xl" />
            </div>

            <div class="flex flex-row flex-wrap flex-1 gap-1 ml-5">
              {#each items as item (item.id)}
                <MediaCard
                  url={item.url}
                  time={mediaTime(
                    item.uploadedAt.getHours(),
                    item.uploadedAt.getMinutes()
                  )}
                />
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <h1 class="font-comforta text-3xl text-white font-bold text-center">
        No images to load babe or images are loading
      </h1>
    {/if}
  </main>

  <UploadFileDialog
    {data}
    {showModal}
    on:files-uploaded={newlyUploaded}
    on:upload-model={(event) => (showModal = event.detail.opened)}
  />
{/if}

<svelte:head>
  <title>Snaps Store</title>
</svelte:head>
