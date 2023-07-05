<script lang="ts">
  import { Plus, ChevronDown } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let email: string;

  const dispatchUploadDialog = () => {
    dispatch("reveal-dialog", {
      value: "BUTTON_CLICKED",
    });
  };

  const dispatchLogout = () => {
    dispatch("logout", {
      value: true,
    });
  };

  const dispatchLogin = () => {
    dispatch("login", {
      value: true,
    });
  };

  const dispatchSwitch = () => {
    dispatch("switch", {
      value: true,
    });
  };

  let revealDropDown = false;
</script>

<nav
  class="bg-[#14213d] text-[#fca311] flex items-center flex-row justify-between py-4 px-3 shadow-xl sticky top-0 z-50"
>
  <div
    class="text-3xl font-bold tracking-wide font-comforta hover:underline underline-offset-8 decoration-wavy"
  >
    Snaps Store
  </div>

  {#if email !== ""}
    <div class="flex flex-row gap-3">
      <button
        class="bg-[#13315c] rounded-2xl p-1 group bg-opacity-80 duration-100 hover:bg-opacity-100"
        on:click={dispatchUploadDialog}
        title="Upload file"
      >
        <Plus
          size={40}
          color="#2B2A4C"
          class="group-hover:rotate-180 stroke-[#fca311] duration-150"
        />
      </button>

      <button
        class="relative inline-flex gap-1 bg-[#13315c] rounded-2xl items-center justify-center px-3"
        on:click={() => (revealDropDown = !revealDropDown)}
      >
        <span>{email}</span>
        <ChevronDown />

        {#if revealDropDown}
          <div
            class="absolute bg-[#13315c] rounded-2xl flex flex-col top-[110%] w-full p-2 gap-2"
          >
            <span
              class="py-1 hover:ring-1 ring-[#fca311] rounded-lg"
              tabindex="0"
              on:click={dispatchSwitch}>Switch Account</span
            >
            <span
              class="py-1 hover:ring-1 ring-[#fca311] rounded-lg"
              tabindex="0"
              on:click={dispatchLogout}>Logout</span
            >
          </div>
        {/if}
      </button>
    </div>
  {:else}
    <button
      class="bg-[#13315c] p-3 rounded-xl cursor-pointer bg-opacity-80 duration-100 hover:bg-opacity-100 h-full"
      on:click={dispatchLogin}>Log in with Google</button
    >
  {/if}
</nav>
