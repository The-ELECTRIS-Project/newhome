<script lang="ts">
  import { onMount } from 'svelte';
  import { theme, colorScheme, applyStyles } from '$lib/stores/theme';
  import { initializeI18n } from '$lib/stores/i18n';
  import NavBar from '$lib/UI/NavBar.svelte';
  import Cursor from '$lib/UI/Cursor.svelte';
  import Popup from '$lib/Mobile/Popup.svelte';
  import '/src/app.base.css';

  onMount(() => {
    (async () => {
      await initializeI18n();
    })();

    const unsubscribeTheme = theme.subscribe(currentTheme => {
      const currentColorScheme = $colorScheme;
      applyStyles(currentTheme, currentColorScheme);
    });

    const unsubscribeColorScheme = colorScheme.subscribe(currentColorScheme => {
      const currentTheme = $theme;
      applyStyles(currentTheme, currentColorScheme);
    });

    return () => {
      unsubscribeTheme();
      unsubscribeColorScheme();
    };
  });
</script>

<svelte:head>
  <title>NewHome | ELECTRIS</title>
  <meta property="og:title" content="ELECTRIS NewHome" />
  <meta property="og:description" content="ELECTRIS NewHome | A New Home for your browser"/>
  <meta property="og:url" content="https://new.electris.net/" />
  <meta name="twitter:title" content="ELECTRIS NewHome"/>
  <meta name="twitter:description" content="ELECTRIS NewHome | A New Home for your browser"/>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<main data-theme={$theme} data-color-scheme-selected={$colorScheme} class="newhome-layout">
  <NavBar />
  <Cursor />
  <Popup />
  <slot />
</main>

<style>
  .newhome-layout {
    min-height: 100vh;
    background: var(--bg-primary, #0f1411);
    color: var(--text-primary, #ff6811);
    position: relative;
    font-family: 'Redwing', sans-serif;
  }

  :global([data-theme="dark"]) .newhome-layout {
    --bg-primary: hsl(160, 7%, 8%);
    --text-primary: hsl(22, 99%, 48%);
    --accent-color: #ff6811;
    --accent-secondary: #f65901;
  }

  :global([data-theme="light"]) .newhome-layout {
    --bg-primary: #f5f1f8;
    --text-primary: #ff5608;
    --accent-color: #ff5608;
    --accent-secondary: #ff6811;
  }

  :global([data-theme="midnight"]) .newhome-layout {
    --bg-primary: #000000;
    --text-primary: #ff6811;
    --accent-color: #ff6811;
    --accent-secondary: #f65901;
  }

  :global(.newhome-layout) {
    scroll-behavior: smooth;
  }

  :global(.newhome-layout *) {
    font-family: inherit;
  }

  :global(.newhome-layout .circle) {
    border-color: var(--accent-color, #ff6811);
  }

  :global(.newhome-layout .circle.hovered-text-grow) {
    border-color: var(--accent-secondary, #f65901);
  }

  :global(.newhome-layout .circle.hovered-button-grow) {
    border-color: var(--accent-color, #ff6811);
  }

  @media (max-width: 768px) {
    .newhome-layout {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .newhome-layout {
      font-size: 0.85rem;
    }
  }
</style>