<template>
    <header>
        <div class="header_content">
            Máquina Expendedora de Café Bianchini
        </div>
    </header>
    <body v-if="machineOutOfService">
        Máquina fuera de servicio.
    </body>
    <body v-if="!userIsPaying && !machineOutOfService">
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
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="background-color: brown">
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
            <button class="btn btn-primary mr-5" @click="AddCoffeeToOrder(selectedCoffee, selectedQuantity)" style="background-color: brown;">
                Agregar a la orden
            </button>
        </div>
        <div style="padding: 10px;"><strong>Órden:</strong></div>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Café</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Costo</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(quantity, type) in order" :key="quantity">
                    <td v-if="quantity > 0">{{type}}</td>
                    <td v-if="quantity > 0">{{ quantity }}</td>
                    <td v-if="quantity > 0">{{ (coffeeTypes[type].price * quantity) }}</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td> Total: {{ totalAmount }}</td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-center align-items-center">
            <button class="btn btn-primary" @click="userIsPaying = !userIsPaying" style="background-color: brown;">Pagar</button>
        </div>
    </body>
    <body v-if="userIsPaying && !machineOutOfService">
        <div class="d-flex justify-content-center align-items-center" style="padding: 20px;" v-if="!showChangeBreakdown && !machineOutOfService">
            <div class="mr-5">
                Total a pagar: {{ totalAmount }}
            </div>
            <div class="mr-5" style="display:flex; flex-direction:row; gap:10px">
                <label for="1000quantity">1000:</label>
                <input type="number" id="1000quantity" value="0" min="0" max="100" class="form-control" v-model.number="coinsUserHasInserted[1000]">
                <label for="500quantity">500:</label>
                <input type="number" id="500quantity" value="0" min="0" max="100" class="form-control" v-model.number="coinsUserHasInserted[500]">
                <label for="100quantity">100:</label>
                <input type="number" id="100quantity" value="0" min="0" max="100" class="form-control" v-model.number="coinsUserHasInserted[100]">
                <label for="50quantity">50:</label>
                <input type="number" id="50quantity" value="0" min="0" max="100" class="form-control" v-model.number="coinsUserHasInserted[50]">
                <label for="25quantity">25:</label>
                <input type="number" id="25quantity" value="0" min="0" max="100" class="form-control" v-model.number="coinsUserHasInserted[25]">
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center" style="padding: 20px; flex-direction: column; gap:15px" v-if="!showChangeBreakdown && !machineOutOfService">
            <div>
                Total: {{ AmountUserPaid }}
            </div>
            <button class="btn btn-primary" @click="CheckAmountUserPaid()" style="background-color: brown;">
                Confirmar
            </button>
        </div>
        <div v-if="showChangeBreakdown && !machineOutOfService" style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh;">
            <div style="text-align: center;">
                Su vuelto es de {{ totalChange }} colones. <br/>
                Desglose:
            </div>
            <ul v-for="(amount, type) in coinsForChange" :key="type" style="list-style-type: none; padding: 0;">
                <li v-if="amount > 0" style="text-align: center;">
                    {{ amount }} moneda de {{ type }}
                </li>
            </ul>
            <button  class="btn btn-primary" @click="FinishOperation" style="background-color: brown;">Aceptar</button>
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
                selectedCoffee: '',
                selectedQuantity: 0,
                order: {
                    Americano: 0,
                    Capuchino: 0,
                    Late: 0,
                    Mocachino: 0
                },
                totalAmount: 0,
                coinsAvailableForChange: {
                    500: 20,
                    100: 30,
                    50: 50,
                    25: 25
                },
                coinsUserHasInserted: {
                    1000: 0,
                    500: 0,
                    100: 0,
                    50: 0,
                    25: 0
                },
                userIsPaying: false,
                coinsForChange: {
                    500: 0,
                    100: 0,
                    50: 0,
                    25: 0
                },
                totalChange: 0,
                showChangeBreakdown : false,
                machineOutOfService : false,
            }
        },
        methods: {
            AddCoffeeToOrder(coffeeType, quantity) {
                if (this.CheckQuantity(coffeeType, quantity)) {
                    this.order[coffeeType] += quantity
                    this.UpdateCoffeeQuantity(coffeeType, quantity)
                } else {
                    alert("Cantidad inválida.")
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
            CheckAmountUserPaid() {
                if (this.totalAmount == this.AmountUserPaid) {
                    this.CalculateChange()
                } else if (this.totalAmount < this.AmountUserPaid) {
                    this.CheckIfMachineHasForChange()
                } else if (this.totalAmount > this.AmountUserPaid) {
                    alert("Cantidad insuficiente!")
                }
            },
            CheckIfMachineHasForChange() {
                const difference = this.AmountUserPaid - this.totalAmount
                if (difference > this.AmountAvailableForChange) {
                    alert("Fallo al realizar la compra. Sin suficientes fondos para el vuelto.")
                    for (let coffeeType in this.order) {
                    if (this.order[coffeeType] > 0) {
                        this.coffeeTypes[coffeeType].quantity += this.order[coffeeType];
                        this.FinishOperation()
                    }
                }
                } else {
                    this.CalculateChange()
                }
            },
            CalculateChange() {
                this.showChangeBreakdown = true
                const denominations = [500, 100, 50, 25]
                const difference = this.AmountUserPaid - this.totalAmount
                let remainingChange = difference
                denominations.forEach(denomination => {
                    while (remainingChange >= denomination && this.coinsAvailableForChange[denomination] > 0) {
                        this.totalChange += denomination
                        remainingChange -= denomination
                        this.coinsForChange[denomination] += 1
                        this.coinsAvailableForChange[denomination] -= 1
                    }
                });
            },
            CheckAmountOfCoffees() {
                if (this.coffeeTypes.Americano.quantity == 0 &&
                    this.coffeeTypes.Capuchino.quantity == 0 &&
                    this.coffeeTypes.Late.quantity == 0 &&
                    this.coffeeTypes.Mocachino.quantity == 0
                ) {
                    this.GetMachineOutOfService()
                }
            },
            CheckAmountOfCoinsForChange() {
                if (this.coinsAvailableForChange[500] == 0 &&
                    this.coinsAvailableForChange[100] == 0 &&
                    this.coinsAvailableForChange[50] == 0 &&
                    this.coinsAvailableForChange[25] == 0
                ) {
                    this.GetMachineOutOfService()
                }
            },
            GetMachineOutOfService() {
                this.machineOutOfService = true
                this.showChangeBreakdown = false
                this.userIsPaying = false
            },
            FinishOperation() {
                this.showChangeBreakdown = false
                this.userIsPaying = false
                this.totalAmount = 0
                this.totalChange = 0
                this.order = {
                    Americano: 0,
                    Capuchino: 0,
                    Late: 0,
                    Mocachino: 0
                }
                this.coinsUserHasInserted = {
                    1000: 0,
                    500: 0,
                    100: 0,
                    50: 0,
                    25: 0
                }
                this.coinsForChange = {
                    500: 0,
                    100: 0,
                    50: 0,
                    25: 0
                }
                this.CheckAmountOfCoinsForChange()
                this.CheckAmountOfCoffees()
            }
        }, 
        computed: {
            AmountUserPaid() {
                return this.coinsUserHasInserted[1000] * 1000 +
                this.coinsUserHasInserted[500] * 500 +
                this.coinsUserHasInserted[100] * 100 +
                this.coinsUserHasInserted[50] * 50 +
                this.coinsUserHasInserted[25] * 25
            },
            AmountAvailableForChange() {
                return this.coinsAvailableForChange[500] * 500 +
                this.coinsAvailableForChange[100] * 100 +
                this.coinsAvailableForChange[50] * 50 +
                this.coinsAvailableForChange[25] * 25
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