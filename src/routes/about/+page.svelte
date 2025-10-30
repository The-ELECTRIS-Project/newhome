<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/stores/i18n';
  import { useHoverConfig, type HoverConfig } from '$lib/stores/hoverConfig';

  const hoverConfigs: HoverConfig[] = [
    {
      type: [ 'h1' ],
      selectors: [ '.title' ],
      className: 'hovered-word-wrap',
      lockPosition: true,
      wrapText: {
        words: false,
        sentences: true
      }
    },
    {
      type: [ 'p' ],
      selectors: [ '.soon' ],
      className: 'hovered-word-wrap',
      lockPosition: true,
      wrapText: {
        words: true,
        sentences: false,
        ignoreCharacters: true,
        ignorePunctuation: true
      }
    }
  ];

  useHoverConfig(hoverConfigs);

  onMount(() => {
    const cursorReset = () => {
      const cursor = document.querySelector('.circle');
      if (cursor) {
        cursor.className = "circle";
      }
    };

    setTimeout(cursorReset, 10);
  });
</script>

<svelte:head>
  <title>About Us | ELECTRIS</title>
</svelte:head>

<div class="hero">
  <h1 class="title"><u>{$t('about.title', 'About Us')}</u></h1>
  <p class="soon">{$t('about.undertitle', '[More info coming here soon]')}</p>
</div>
  
<style>
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 80px;
    text-align: center;
  }

  .hero h1 {
    font-size: 4rem;
    margin: 0;
  }

  .hero p {
    font-family: 'Nightcore';
    font-size: 6.5rem;
    margin-top: 20px;
    max-width: 80%;
  }
</style>