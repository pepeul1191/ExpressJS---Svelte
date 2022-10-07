<script>
  import { onMount } from 'svelte';
  let pokemons = [];

  onMount(() => {    
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          document.body.className = 'ok';
          pokemons = JSON.parse(this.responseText);
        } else if (this.response == null && this.status === 0) {
          document.body.className = 'error offline';
          console.log("The computer appears to be offline.");
        } else {
          document.body.className = 'error';
        }
      }
    };
    request.open("GET", '/pokemon/list', true);
    request.send(null);
  });
</script>

<div class="row"> 
  <div class="col-md-12">
    <h4>Lista de Pokemones</h4>
    <table>
      <thead>
        <th>Número</th>
        <th>Nombre</th>
        <th>Tipo 1</th>
        <th>Tipo 2</th>
        <th>Peso</th>
        <th>Talla</th>
        <th>Imagen</th>
      </thead>
      {#each pokemons as pokemon}
        <tr>
          <td>{pokemon.number}</td>
          <td>{pokemon.name}</td>
          <td>{pokemon.type_1}</td>
          <td>{pokemon.type_2}</td>
          <td>{pokemon.weight}</td>
          <td>{pokemon.height}</td>
          <td>
            <img src="{pokemon.img.replace('/images/', '/assets/images/')}" height=50 width=50 alt="{pokemon.number} - {pokemon.name}">
          </td>
        </tr>
      {/each}
    </table>
  </div>
</div>

<style>
  .row{
    margin-left: 20px;
    margin-top: 20px;
  }
</style>