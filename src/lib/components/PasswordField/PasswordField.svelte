<script>
    import TextField from "../TextField/TextField.svelte";
    import Icon from "../Icon/Icon.svelte";
    import icons from "../../internal/Icons";
    let klass = '';
    export { klass as class };
    export let value = '';
    export let showPassword = false;
</script>

<TextField
        {...$$restProps}
		class={klass}
		type={!showPassword ? 'password' : 'text'}
		bind:value={value}
	>
		<Icon 
            on:click={() => (showPassword = !showPassword)}  
            style="cursor:pointer" 
            slot="append" 
            path={showPassword ? icons.visibility_off : icons.visibility}/>
            
        <slot slot="prepend-outer" name="prepend-outer" />
        <slot slot="prepend" name="prepend"  />
		<slot/>
        <slot slot="append-outer" name="append-outer" />
</TextField>