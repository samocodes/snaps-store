<script lang="ts">
  import "../app.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";

  export let data;

  let { supabase, session } = data;
  $: ({ supabase, session } = data);

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => subscription.unsubscribe();
  });
</script>

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="bg-zinc-950 h-screen select-none">
  <slot />
</div>
