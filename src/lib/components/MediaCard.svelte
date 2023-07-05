<script lang="ts">
  import { ALLOWED_FORMATS } from "$lib/constants";
  import { Trash } from "lucide-svelte";

  export let url: string;
  export let time: string;

  function getFileExtension(): string {
    const fileExtensionRegex = /[^/\\&?]+\.\w{2,}$/;
    const match = new URL(url).pathname.toLowerCase().match(fileExtensionRegex);
    return match ? match[0].split(".")[1] : "";
  }

  let supportedVideoFormats: string[];
  let supportedImageFormats: string[];
  let fileExtension: string;

  function isValidFileFormat(): boolean {
    fileExtension = getFileExtension();

    if (fileExtension) {
      supportedVideoFormats = ALLOWED_FORMATS.map((format) => {
        const [type, subtype] = format.split("/");
        return type === "video" ? subtype : "";
      }).filter((format) => format !== "");

      supportedImageFormats = ALLOWED_FORMATS.map((format) => {
        const [type, subtype] = format.split("/");
        return type === "image" ? subtype : "";
      }).filter((format) => format !== "");

      if (supportedVideoFormats.includes(fileExtension)) {
        return true;
      }

      if (supportedImageFormats.includes(fileExtension)) {
        return true;
      }
    }

    return false;
  }

  // let selected: string = "";
  // $: if (selected) {
  //   document.body.style.pointerEvents = "none";
  //   document.body.style.background = 'rgb'
  // } else {
  //   document.body.style.pointerEvents = "auto";
  // }
</script>

{#if isValidFileFormat()}
  {#if supportedVideoFormats.includes(fileExtension ?? "")}
    <video
      src={url}
      muted
      autoplay
      loop
      tabindex="0"
      class="max-h-[150px] max-w-[500px] object-cover object-left-top w-auto"
    />
  {:else if supportedImageFormats.includes(fileExtension ?? "")}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="relative group cursor-pointer">
      <img
        src={url}
        alt="lmao"
        draggable="false"
        tabindex="0"
        class="max-h-[155px] max-w-[500px] object-cover object-left-top w-auto duration-100 group-hover:brightness-75"
      />

      <!-- INFO -->
      <div
        class="absolute bottom-0 left-0 py-3 px-5 group-hover:opacity-100 flex duration-100 opacity-0 flex-row items-center justify-between bg-gradient-to-b from-transparent to-black w-full"
      >
        <!-- uploaded at -->
        <span class="text-white text-lg font-bold">{time}</span>

        <button
          class="bg-red-700 p-1 rounded-lg"
          on:click={() => alert("To be implemented later.")}
        >
          <Trash class=" stroke-red-50" />
        </button>
      </div>
    </div>
  {/if}
{:else}
  <!-- Code to render if the file format is not supported -->
{/if}

<!-- to render the bigger version of vid/img -->
<!-- {#if selected}
  <Media url={selected} />
{/if} -->
