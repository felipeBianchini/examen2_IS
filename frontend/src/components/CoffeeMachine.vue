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
        <div class="d-flex justify-content-center align-items-center" style="padding-left: 20px;">
            <div class="dropdown mr-5">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{ selectedCoffee || 'Seleccione un tipo de café' }}
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#" v-for="(coffee, type) in coffeeTypes" :key="type" @click="selectedCoffee = type">
                        {{ type }}
                    </a>
                </div>
            </div>
            <div class="mr-5">
                <label for="quantity">Cantidad:</label>
                <input type="number" id="quantity" value="0" min="0" max="20" class="form-control" v-model="selectedQuantity">
            </div>
            <button class="btn btn-primary mr-5" @click="AddCoffeeToOrder(selectedCoffee, selectedQuantity)">
                Agregar a la orden
            </button>
        </div>
        <div style="padding: 10px;"><strong>Órden:</strong></div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Café</th>
                    <th scope="col">Cantidad</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(quantity, type) in order" :key="quantity">
                    <td>{{type}}</td>
                    <td>{{ quantity }}</td>
                </tr>
            </tbody>
        </table>
        <div>Monto total: {{ totalAmount }}</div>
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
                selectedCoffee: '',
                selectedQuantity: 0,
                order: {
                    Americano: 0,
                    Capuchino: 0,
                    Late: 0,
                    Mocachino: 0
                },
                totalAmount: 0,
            }
        },
        methods: {
            AddCoffeeToOrder(coffeeType, quantity) {
                if (this.CheckQuantity(coffeeType, quantity)) {
                    this.order[coffeeType] += quantity
                    this.UpdateCoffeeQuantity(coffeeType, quantity)
                } else {
                    alert("La cantidad ingresada supera la cantidad disponible.");
                }
                this.selectedCoffee = ''
                this.selectedQuantity = 0
            },
            CheckQuantity(coffeeType, quantity) {
                return (this.coffeeTypes[coffeeType].quantity >= quantity)
            },
            UpdateCoffeeQuantity(coffeeType, quantity) {
                this.coffeeTypes[coffeeType].quantity -= quantity
                this.UpdateTotalAmount(this.coffeeTypes[coffeeType].price, quantity)
            },
            UpdateTotalAmount(coffeePrice, quantity) {
                this.totalAmount += (coffeePrice * quantity)
            },
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