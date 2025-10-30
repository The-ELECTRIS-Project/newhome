<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  $: error = $page.error;
  $: status = $page.status;

  onMount(() => {
    const cursorReset = () => {
      const cursor = document.querySelector('.circle');
      if (cursor) {
        cursor.className = "circle";
      }
    };

    setTimeout(cursorReset, 10);
  });

  const goBack = () => {
    history.back();
  };
</script>

<svelte:head>
  <title>Error {status} - ELECTRIS</title>
</svelte:head>

<div class="error-page">
  <div class="error-container">
    <div class="error-icon">
      <div class="broken-gear gear-1"></div>
      <div class="broken-gear gear-2"></div>
      <div class="error-sparks">
        <div class="error-spark spark-1"></div>
        <div class="error-spark spark-2"></div>
        <div class="error-spark spark-3"></div>
        <div class="error-spark spark-4"></div>
      </div>
      <div class="crack-line"></div>
    </div>

    <div class="error-content">
      <h1>
        <span class="error-text-glitch" data-text="ERROR">ERROR</span>
        <span class="status-glitch" data-text="{status}"> {status}</span>
      </h1>

      {#if status === 404}
        <p class="error-message">Page not found in the ELECTRIS project</p>
        <p class="error-submessage">The page you're looking for has disappeared or never existed</p>
      {:else}
        <p class="error-message">Something went wrong in the ELECTRIS system</p>
        <p class="error-submessage">{error?.message || 'An unexpected error occurred'}</p>
      {/if}

      <div class="error-actions">
        <a href="/" class="return-button">
          <span class="button-text">Return to Base</span>
          <div class="button-spark"></div>
        </a>
        <button on:click={goBack} class="back-button">
          <span class="button-text">Go Back</span>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .error-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 4vh 2vh;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .error-page::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(246, 89, 1, 0.03) 50%, transparent 70%);
    animation: error-sweep 5s ease-in-out infinite;
    pointer-events: none;
  }

  .error-container {
    position: relative;
    z-index: 2;
    max-width: 60vh;
  }

  .error-icon {
    position: relative;
    margin-bottom: 4vh;
    width: 10vh;
    height: 10vh;
    margin-left: auto;
    margin-right: auto;
  }

  .broken-gear {
    position: absolute;
    border-radius: 50%;
    border: 0.3vh solid #f65901;
    animation: broken-rotate 4s ease-in-out infinite;
  }

  .broken-gear::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background: radial-gradient(circle, transparent 40%, #f65901 42%, #f65901 58%, transparent 60%);
  }

  .gear-1 {
    width: 7vh;
    height: 7vh;
    top: 0;
    left: 1.5vh;
    animation-duration: 3s;
  }

  .gear-2 {
    width: 5vh;
    height: 5vh;
    top: 2.5vh;
    right: 0;
    animation-direction: reverse;
    animation-duration: 4s;
    opacity: 0.7;
  }

  .crack-line {
    position: absolute;
    top: 3vh;
    left: 3vh;
    width: 4vh;
    height: 0.2vh;
    background: linear-gradient(45deg, transparent, #ff3300, transparent);
    transform: rotate(45deg);
    animation: crack-glow 2s ease-in-out infinite;
  }

  .crack-line::before {
    content: '';
    position: absolute;
    top: 1vh;
    left: 1vh;
    width: 2vh;
    height: 0.1vh;
    background: linear-gradient(45deg, transparent, #ff3300, transparent);
    transform: rotate(-30deg);
  }

  .error-sparks {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .error-spark {
    position: absolute;
    width: 0.3vh;
    height: 0.3vh;
    background: #ff3300;
    border-radius: 50%;
    animation: error-sparkle 1.5s ease-in-out infinite;
    box-shadow: 0 0 0.5vh #ff3300;
  }

  .spark-1 {
    top: 10%;
    left: 85%;
    animation-delay: 0s;
  }

  .spark-2 {
    top: 80%;
    left: 15%;
    animation-delay: 0.4s;
  }

  .spark-3 {
    top: 20%;
    left: 20%;
    animation-delay: 0.8s;
  }

  .spark-4 {
    top: 70%;
    left: 80%;
    animation-delay: 1.2s;
  }

  .error-content h1 {
    font-family: 'Letric';
    font-size: 3rem;
    margin: 0 0 2vh 0;
    position: relative;
  }

  .error-text-glitch, .status-glitch {
    position: relative;
    animation: error-glitch 2s ease-in-out infinite;
    text-shadow: 0.1vh 0.1vh 0.2vh rgba(255, 51, 0, 0.3);
    display: inline-block;
    color: #ff3300;
  }

  .error-text-glitch {
    font-family: 'Letric';
  }

  .status-glitch {
    font-family: 'Redwing';
    font-weight: 600;
  }

  .error-text-glitch::before,
  .error-text-glitch::after,
  .status-glitch::before,
  .status-glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.6;
  }

  .error-text-glitch::before,
  .status-glitch::before {
    animation: error-glitch-1 2s ease-in-out infinite;
    color: #ff6600;
    z-index: -1;
  }

  .error-text-glitch::after,
  .status-glitch::after {
    animation: error-glitch-2 2s ease-in-out infinite;
    color: #ff0033;
    z-index: -2;
  }

  .error-message {
    font-family: 'Redwing';
    font-size: 1.3rem;
    margin-bottom: 1vh;
    font-weight: 500;
    color: #f65901;
  }

  .error-submessage {
    font-family: 'Redwing';
    font-size: 1rem;
    margin-bottom: 4vh;
    opacity: 0.8;
    font-weight: 300;
  }

  .error-actions {
    display: flex;
    flex-direction: column;
    gap: 2vh;
    align-items: center;
  }

  .return-button, .back-button {
    position: relative;
    padding: 1.2vh 3vh;
    border: 0.2vh solid #f65901;
    background: rgba(246, 89, 1, 0.1);
    color: #f65901;
    font-family: 'Redwing';
    font-size: 1.1rem;
    font-weight: 500;
    border-radius: 0.5vh;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
    overflow: hidden;
  }

  .return-button:hover, .back-button:hover {
    background: rgba(246, 89, 1, 0.2);
    box-shadow: 0 0 1vh rgba(246, 89, 1, 0.5);
    transform: translateY(-0.2vh);
  }

  .button-text {
    position: relative;
    z-index: 2;
  }

  .button-spark {
    position: absolute;
    top: 50%;
    right: 1vh;
    width: 0.3vh;
    height: 0.3vh;
    background: #f65901;
    border-radius: 50%;
    transform: translateY(-50%);
    animation: button-spark-pulse 2s ease-in-out infinite;
    box-shadow: 0 0 0.5vh #f65901;
  }

  @media (max-width: 768px) {
    .error-content h1 {
      font-size: 2.2rem;
    }

    .error-message {
      font-size: 1.1rem;
    }

    .error-submessage {
      font-size: 0.9rem;
    }

    .error-actions {
      flex-direction: column;
    }
  }

  @keyframes error-sweep {
    0%, 100% { transform: translateX(-100%); }
    50% { transform: translateX(100%); }
  }

  @keyframes broken-rotate {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(90deg); }
    50% { transform: rotate(180deg); }
    75% { transform: rotate(270deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes crack-glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; box-shadow: 0 0 1vh #ff3300; }
  }

  @keyframes error-sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    25% { opacity: 1; transform: scale(1.5); }
    50% { opacity: 0.7; transform: scale(1); }
    75% { opacity: 1; transform: scale(1.2); }
  }

  @keyframes error-glitch {
    0%, 100% { transform: translate(0); }
    10% { transform: translate(-0.15vh, 0.15vh); }
    20% { transform: translate(-0.15vh, -0.15vh); }
    30% { transform: translate(0.15vh, 0.15vh); }
    40% { transform: translate(0.15vh, -0.15vh); }
    50% { transform: translate(0); }
    60% { transform: translate(-0.1vh, 0.1vh); }
    70% { transform: translate(0.1vh, -0.1vh); }
    80% { transform: translate(0); }
    90% { transform: translate(-0.15vh, 0.15vh); }
  }

  @keyframes error-glitch-1 {
    0%, 100% { transform: translate(0); opacity: 0.6; }
    10% { transform: translate(-0.3vh, 0.3vh); opacity: 0.4; }
    20% { transform: translate(-0.3vh, -0.3vh); opacity: 0.4; }
    30% { transform: translate(0.3vh, 0.3vh); opacity: 0.4; }
    40% { transform: translate(0.3vh, -0.3vh); opacity: 0.4; }
    50% { transform: translate(0); opacity: 0.6; }
    60% { transform: translate(-0.2vh, 0.2vh); opacity: 0.5; }
    70% { transform: translate(0.2vh, -0.2vh); opacity: 0.5; }
    80% { transform: translate(0); opacity: 0.6; }
    90% { transform: translate(-0.3vh, 0.3vh); opacity: 0.4; }
  }

  @keyframes error-glitch-2 {
    0%, 100% { transform: translate(0); opacity: 0.6; }
    10% { transform: translate(0.3vh, -0.3vh); opacity: 0.4; }
    20% { transform: translate(0.3vh, 0.3vh); opacity: 0.4; }
    30% { transform: translate(-0.3vh, -0.3vh); opacity: 0.4; }
    40% { transform: translate(-0.3vh, 0.3vh); opacity: 0.4; }
    50% { transform: translate(0); opacity: 0.6; }
    60% { transform: translate(0.2vh, -0.2vh); opacity: 0.5; }
    70% { transform: translate(-0.2vh, 0.2vh); opacity: 0.5; }
    80% { transform: translate(0); opacity: 0.6; }
    90% { transform: translate(0.3vh, -0.3vh); opacity: 0.4; }
  }

  @keyframes button-spark-pulse {
    0%, 100% { opacity: 0.5; transform: translateY(-50%) scale(1); }
    50% { opacity: 1; transform: translateY(-50%) scale(1.5); }
  }
</style>