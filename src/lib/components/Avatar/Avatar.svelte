<script lang="ts">
    import "./Avatar.scss"
    import {format} from '../../internal/Style';
    let klass:string = '';
    /** classes to add to avatar */
    export { klass as class };
     /** height and width of the avatar. */
    export let size: string | number = 48;
    /** removes border radius */
    export let tile:boolean = false;
    /** styles applied to the avatar */
    export let style:string = '';
  </script>
  
  
  <div class="s-avatar {klass}" class:tile style="--s-avatar-size:{format(size)};{style}">
    <slot />
  </div>