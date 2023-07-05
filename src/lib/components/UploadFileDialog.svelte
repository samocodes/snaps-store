<script lang="ts">
  import { ALLOWED_FORMATS, BUCKET_NAME } from "$lib/constants";
  import { Trash, X } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  import {
    removeFromTemp,
    revealFileExplorer,
    uploadToTemp,
  } from "$lib/helpers/fileUploads";
  import files from "$lib/store/files";

  import type { Session, SupabaseClient } from "@supabase/supabase-js";

  export let data: {
    supabase: SupabaseClient<any, "public", any>;
    session: Session | null;
  };
  export let showModal: boolean;

  let { supabase, session } = data;
  $: ({ supabase } = data);

  const dispatch = createEventDispatcher();
  let dialog: HTMLDialogElement;

  function closeModel() {
    dispatch("upload-model", {
      opened: false,
    });

    dialog.close();
  }

  function uploadToSupabase(event: Event) {
    event.preventDefault();

    $files.forEach(async (file, index) => {
      if (!session) return;

      const filePath = `${session.user.id}/${file.name}`;
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          upsert: false,
        });

      if (data) {
        if (index == $files.length - 1) {
          dispatch("files-uploaded", {
            files: [...$files],
          });
        }
      }

      if (error) {
        const promt = confirm(
          `File: "${file.name}" already exist. Do you want to override it?`
        );

        if (!promt) return;

        const filePath = `${session.user.id}/${file.name}`;
        await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
          upsert: true,
        });
      }

      files.set([]);
      dialog.close();
    });
  }

  $: if (dialog && showModal) {
    dialog.showModal();
    document.body.style.overflow = "hidden";
  } else if (dialog && !showModal) {
    document.body.style.overflow = "auto";
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  on:close={closeModel}
  on:click|self={closeModel}
  tabindex="-1"
  class="backdrop:bg-black backdrop:bg-opacity-40 backdrop-blur-3xl w-[40vw] h-[50vh] rounded-2xl relative animate-zoom bg-[#14213d]"
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    on:click|stopPropagation
    class="flex flex-col h-full w-full overflow-hidden"
  >
    <!-- HEADER -->
    <div class=" w-full flex flex-row items-center justify-between px-5 py-3">
      <span class="text-xl font-semibold tracking-wide text-[#fca311]"
        >Upload file</span
      >
      <button on:click={() => dialog.close()}>
        <X class="stroke-[#fca311]" />
      </button>
    </div>

    <hr class="border-[#fca311]" />

    <div class="flex flex-col items-center justify-start pt-5 h-full gap-5">
      <input
        type="file"
        name="file"
        id="file"
        class="hidden"
        accept={ALLOWED_FORMATS.join(", ")}
        multiple
        on:change={uploadToTemp}
      />

      <!-- SELECTED FILES -->
      {#if $files.length}
        <div
          class="grid grid-cols-2 gap-5 justify-start overflow-y-scroll pb-36 hide-scroll-bar"
        >
          {#each $files as file, index}
            <div
              class="w-full bg-blue-500 p-2 rounded-xl bg-opacity-20 text-black inline-flex items-center justify-between gap-2"
            >
              <span class="overflow-hidden truncate text-white">
                {file.name}
              </span>

              <button
                class="p-2 bg-red-500 bg-opacity-20 rounded-lg"
                on:click={() => removeFromTemp(index)}
              >
                <Trash class="stroke-red-500" />
              </button>
            </div>
          {/each}
        </div>
      {/if}

      <div
        class="absolute bottom-0 right-0 rounded-lg m-1 space-x-2 flex flex-row items-center justify-between left-0 bg-[#14213d] p-2"
      >
        <button
          class="bg-[#13315c] text-[rgb(34,139,230)] py-3 px-5 font-bold rounded-md"
          on:click={() => revealFileExplorer("file")}
          >Click here to select the files</button
        >

        <div class="inline-flex items-center gap-2">
          <button
            on:click={() => {
              files.set([]);
            }}
            class="text-red-500 bg-red-950 hover:bg-red-900 font-bold px-5 py-2 rounded-md"
            >Clear</button
          >
          <button
            on:click={uploadToSupabase}
            class="bg-green-950 hover:bg-green-900 text-green-500 font-bold px-5 py-2 rounded-md"
            >Upload</button
          >
        </div>
      </div>
    </div>
  </div>
</dialog>
