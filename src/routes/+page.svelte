<script lang="ts">
  import {
    Select,
    MaterialApp,
    ComboBox,
    Menu,
    ListItem,
    Button,
    List,
    Toasts,
  } from '@paulpopa/svelte-material';


  let multipleValue = [];
  let values=["1","2","3","4","5"]
    async function stall(stallTime = 3000) {
    await new Promise(resolve => setTimeout(resolve, stallTime));
  }
  const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black", "Mät bläck", "<i>Jét Black</i>"];
  async function searchColor(keyword:string) {
    await stall(200);
    if(!keyword) return colors;
    return colors.filter(x=>x.toLowerCase().includes(keyword.toLowerCase()))
}
</script>

<MaterialApp class="h-full" theme="dark" style="height:100%">
  <div style="padding:20px;width:500px;margin:auto;overflow:hidden">
  <Select  bottom={false} multiple bind:value={multipleValue} items={values}>select</Select>
  <Toasts top right />
  <Select chips multiple bind:value={multipleValue} items={values}>select</Select>

  <ComboBox multiple chips bind:value={multipleValue} search={searchColor}>combobox</ComboBox>
  <ComboBox multiple bind:value={multipleValue} search={searchColor}>multiple</ComboBox>


  <ComboBox top chips bind:value={multipleValue} search={searchColor}>single chip</ComboBox>
  <ComboBox bind:value={multipleValue} search={searchColor}>single</ComboBox>

  <Menu hover style="margin-bottom:10px;">
    <div slot="activator">
      <Button class="success-color">Activate</Button>
    </div>
    <List >
      <ListItem>Option 1</ListItem>
      <ListItem>Option 2</ListItem>
      <ListItem>This is Cool</ListItem>
    </List>
  </Menu>
</div>

</MaterialApp>

<style>
  :global(.h-full){
    height:100vh;
  }
  :global(body){
    min-height:100vh;
  }
</style>


