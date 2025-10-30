<script lang="ts">
  let isMenuOpen = false;
  let isClosing = false;
  let buttonElement: HTMLButtonElement;

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      isMenuOpen = true;
      isClosing = false;
    }
  }

  function closeMenu() {
    if (isMenuOpen && !isClosing) {
      isClosing = true;
      setTimeout(() => {
        isMenuOpen = false;
        isClosing = false;
      }, 250);
    }
  }

  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeMenu();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="customize-container">
  <button bind:this={buttonElement} class="customize-button" on:click={toggleMenu} class:active={isMenuOpen} aria-label="Customization menu">
    <img src="/icons/buttons/pen.svg" alt="Customize" class="pen-icon" />
  </button>

  {#if isMenuOpen}
    <div 
      class="menu-overlay" 
      role="button"
      tabindex="0"
      class:closing={isClosing}
      on:click={handleOverlayClick}
      on:keydown={(e) => e.key === 'Escape' && {handleOverlayClick}}
      aria-label="Close Menu"
    >
      <div class="menu-content" class:closing={isClosing}>
        <div class="menu-header">
          <h2>Customize</h2>
          <button 
            class="edit-close-button" 
            on:click={closeMenu}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <div class="menu-body">
          <p class="placeholder-text">Customization options will be added here...</p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .customize-container {
    position: fixed;
    bottom: 1vw;
    right: 1vw;
    z-index: 100;
  }

  .customize-button {
    width: 4vh;
    height: 4vh;
    background: hsl(20, 95%, 51%);
    border: 0.1vh solid hsl(20, 95%, 61%);
    border-radius: 0.8vh;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 0.2vh 0.4vh hsla(20, 95%, 51%, 0.2);
    backdrop-filter: blur(0.5vh);
    position: relative;
    overflow: hidden;
  }

  .customize-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      hsla(0, 0%, 100%, 0.2),
      transparent
    );
    transition: left 0.4s ease;
  }

  .customize-button:hover {
    transform: translateY(-0.2vh);
    background: hsl(20, 95%, 56%);
    border-color: hsl(20, 95%, 66%);
    box-shadow: 0 0.3vh 0.6vh hsla(20, 95%, 51%, 0.3);
  }

  .customize-button:hover::before {
    left: 100%;
  }

  .customize-button:active {
    transform: translateY(-0.1vh) scale(0.98);
  }

  .customize-button.active {
    background: hsl(20, 95%, 46%);
    border-color: hsl(20, 95%, 56%);
    transform: translateY(-0.1vh);
  }

  .pen-icon {
    width: 1.8vh;
    height: 1.8vh;
    transform: rotate(15deg);
    transition: all 0.3s ease;
    filter: brightness(0) invert(1);
  }

  .customize-button:hover .pen-icon {
    transform: rotate(35deg) scale(1.1);
  }

  .customize-button.active .pen-icon {
    transform: rotate(15deg) scale(1.1);
  }

  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: hsla(0, 0%, 0%, 0.35);
    backdrop-filter: blur(0.8vh);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
  }

  .menu-overlay.closing {
    animation: fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .menu-content {
    width: 60vw;
    max-width: 80vh;
    height: 60vh;
    background: hsl(240, 10%, 10%);
    border: 0.2vh solid hsl(20, 95%, 51%);
    border-radius: 2vh;
    box-shadow: 
      0 2vh 4vh hsla(0, 0%, 0%, 0.5),
      0 0 3vh hsla(20, 95%, 51%, 0.3);
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .menu-content.closing {
    animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .menu-header {
    padding: 2vh 3vw;
    border-bottom: 0.1vh solid hsl(20, 95%, 51%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: hsl(240, 10%, 12%);
  }

  .menu-header h2 {
    margin: 0;
    font-size: 2.5vh;
    font-family: 'Letric', sans-serif;
    color: hsl(20, 95%, 61%);
    text-shadow: 0 0 1vh hsla(20, 95%, 51%, 0.3);
  }

  .edit-close-button {
    width: 4vh;
    height: 4vh;
    background: transparent;
    border: 0.1vh solid hsl(0, 0%, 40%);
    border-radius: 0.8vh;
    color: hsl(0, 0%, 70%);
    font-size: 2vh;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .edit-close-button:hover {
    background: hsl(0, 70%, 50%);
    border-color: hsl(0, 70%, 60%);
    color: white;
    transform: scale(1.05);
  }

  .menu-body {
    flex: 1;
    padding: 3vh 3vw;
    overflow-y: auto;
  }

  .placeholder-text {
    color: hsl(0, 0%, 60%);
    font-size: 1.8vh;
    text-align: center;
    margin: 0;
    opacity: 0.7;
    font-family: 'Redwing', sans-serif;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(4vh) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(4vh) scale(0.95);
    }
  }

  /* Mobile responsiveness */
  @media (max-width: 48vh) {
    .customize-button {
      width: 5vh;
      height: 5vh;
      bottom: 1vh;
      right: 2vw;
    }

    .pen-icon {
      width: 2.2vh;
      height: 2.2vh;
    }

    .menu-content {
      width: 90vw;
      height: 70vh;
      margin: 5vh;
    }

    .menu-header {
      padding: 2vh 4vw;
    }

    .menu-body {
      padding: 2vh 4vw;
    }

    .menu-header h2 {
      font-size: 3vh;
    }
  }

  @media (max-width: 73.4vh) {
    .menu-content {
      width: 85vw;
      height: 65vh;
    }
  }
</style>