<script>
    import { onMount } from 'svelte';
    import { MaterialApp, AppBar, Button, Icon } from '$lib/index';
    import SiteNavigation from './navigation/SiteNavigation.svelte';
    import Loading from './navigation/Loading.svelte';
    import { theme } from './util/stores';
    import { mdiMenu, mdiWeatherNight, mdiWeatherSunny } from '@mdi/js';
  
    export let segment;
  

    let sidenav = false;
    let mobile = false;
  
    function checkMobile() {
      mobile = window.width < 1024;
    }
  
    function toggleTheme() {
      if ($theme === 'light') theme.set('dark');
      else theme.set('light');
    }
  
    onMount(() => {
      theme.set(window.localStorage.getItem('theme') || 'light');
      const unsubscribe = theme.subscribe((value) => {
        window.localStorage.setItem('theme', value);
      });
  
  
      return unsubscribe;
    });
  </script>
  
  <style>
    a {
      color: inherit;
    }
    main {
      padding-top: 56px;
    }
    .navigation-enabled {
      padding: 56px 256px 0 256px;
    }
  </style>
  
  <svelte:window on:resize={checkMobile} />
  
  <svelte:head>
    <link
      rel="stylesheet"
      href="prism/material-light.css"
      disabled={$theme === 'dark' ? true : null} />
    <link
      rel="stylesheet"
      href="prism/material-dark.css"
      disabled={$theme === 'light' ? true : null} />
  </svelte:head>
  
  <MaterialApp theme={$theme}>
    <AppBar
      fixed
      style="width:100%"
      class={segment === undefined ? 'primary-color theme--dark' : ''}>
      <div slot="icon">
        {#if mobile && segment !== undefined}
          <Button
            fab
            depressed
            on:click={() => (sidenav = !sidenav)}
            aria-label="Open Menu">
            <Icon path={mdiMenu} />
          </Button>
        {/if}
      </div>
      <a href="/" slot="title" rel="external" class="text--primary"> Svelte Materialify </a>
      <div style="flex-grow:1" />

      <Button fab text on:click={toggleTheme} aria-label="Toggle Theme">
        <Icon path={$theme === 'light' ? mdiWeatherNight : mdiWeatherSunny} />
      </Button>
    </AppBar>
  
    {#if segment !== undefined}
      <SiteNavigation {mobile} bind:sidenav />
    {/if}
  
    <main class:navigation-enabled={!mobile && segment !== undefined}>
      {#if segment !== undefined}
        <Loading />
      {/if}
      <slot />
    </main>
  </MaterialApp>
  