<template>
    <header>
        <div class="header_content">
            Máquina Expendedora de Café Bianchini
        </div>
    </header>
    <body>
        <table class="table">
        <thead>
            <tr>
                <th scope="col">Café</th>
                <th scope="col">Cantidad disponible</th>
                <th scope="col">Precio</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(coffee, type) in coffeeTypes" :key="type">
                <td>{{type}}</td>
                <td>{{ coffee.quantity }}</td>
                <td>{{ coffee.price }}</td>
            </tr>
        </tbody>
        </table>
        <div>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Seleccione un tipo de café:
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#" v-for="(coffee, type) in coffeeTypes" :key="type">
                        {{type}}
                    </a>
                </div>
            </div>
            <label for="quantity">Cantidad:</label>
            <input type="number" value="0" min="0" max="20">
            <button>
                Agregar a la órden
            </button>
            <button>
                Pagar
            </button>
        </div>
    </body>
</template>

<script>
    export default {
        name: "CoffeeMachine",
        data() {
            return {
                coffeeTypes: {
                    Americano: {quantity: 10, price: 950},
                    Capuchino: {quantity: 8, price: 1200},
                    Late: {quantity: 10, price: 1350},
                    Mocachino: {quantity: 15, price: 1500}
                },
                order: {
                    Americano: 0,
                    Capuchino: 0,
                    Late: 0,
                    Mocachino: 0
                },

            }
        }
    }
</script>

<style>
    .header_content {
        background-color: rgb(112, 10, 10);
        text-align: center;
        font-size: larger;
        padding: 20px;
        color: white;
        font-weight: bold;
        font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
    }
</style>