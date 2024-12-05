import { shallowMount } from '@vue/test-utils';
import CoffeeMachine from '@/components/CoffeeMachine.vue';

describe('CoffeeMachine.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CoffeeMachine);
        global.alert = jest.fn();
    });

    it('should add coffee to order if quantity fits stock', () => {
        // Arrange
        wrapper.setData({
            coffeeTypes: {
                Americano: { quantity: 10, price: 950 }
            },
            order: {
                Americano: 0
            }
        });

        // Act
        wrapper.vm.AddCoffeeToOrder('Americano', 2);

        // Assert
        expect(wrapper.vm.order.Americano).toBe(2);
    });

    it('should reduce the stock of a coffee that is now part of an order', () => {
        // Arrange
        wrapper.setData({
            coffeeTypes: {
                Americano: { quantity: 10, price: 950 }
            },
        });

        // Act
        wrapper.vm.AddCoffeeToOrder('Americano', 2);

        // Assert
        expect(wrapper.vm.coffeeTypes.Americano.quantity).toBe(8); 
    });

    it('should calculate the total amount of money based on the order\'s products', () => {
        // Arrange
        wrapper.setData({
            totalAmount: 0,
        });

        // Act
        wrapper.vm.AddCoffeeToOrder('Americano', 1);

        // Assert
        expect(wrapper.vm.totalAmount).toBe(950); 
    });

    it('should not add coffee if quantity exceeds stock', () => {
        // Arrange
        wrapper.setData({
            selectedCoffee: 'Americano',
            selectedQuantity: 12,
            totalAmount: 0,
            coffeeTypes: {
                Americano: { quantity: 10, price: 950 }
            },
            order: {
                Americano: 0
            }
        });

        // Act
        wrapper.vm.AddCoffeeToOrder('Americano', 12);

        // Assert
        expect(wrapper.vm.order.Americano).toBe(0); 
        expect(wrapper.vm.coffeeTypes.Americano.quantity).toBe(10); 
        expect(wrapper.vm.totalAmount).toBe(0); 
    });


    it('should alert if user paid insufficient amount', () => {
        // Arrange
        wrapper.setData({
            totalAmount: 1000,
            coinsUserHasInserted: {
                1000: 0,
                500: 1,
                100: 0,
                50: 0,
                25: 0
            }
        });

        // Act
        wrapper.vm.CheckAmountUserPaid();

        // Assert
        expect(global.alert).toHaveBeenCalledWith('Cantidad insuficiente!');
    });

    it('should calculate change if user overpaid and the machine has enough coins for change', () => {
        // Arrange
        wrapper.setData({
            totalAmount: 1000,
            totalChange: 0,
            coinsUserHasInserted: {
                1000: 1, 
                500: 1  
            },
            coinsAvailableForChange: {
                500: 5, 
                100: 0,
                50: 0,
                25: 0
            },
            coinsForChange: {
                500: 0
            }
        });

        // Act
        wrapper.vm.CheckAmountUserPaid();

        // Assert
        expect(wrapper.vm.totalChange).toBe(500);
        expect(wrapper.vm.coinsForChange[500]).toBe(1); 
        expect(wrapper.vm.coinsAvailableForChange[500]).toBe(4);
    });

    it('change should be 0 if the user pays the exact amount of money', () => {
        // Arrange
        wrapper.setData({
            totalAmount: 1000,
            totalChange: 0,
            coinsUserHasInserted: {
                1000: 1, 
            },
            coinsAvailableForChange: {
                500: 5, 
                100: 5,
                50: 5,
                25: 5
            }
        });

        // Act
        wrapper.vm.CheckAmountUserPaid();

        // Assert
        expect(wrapper.vm.totalChange).toBe(0);
        expect(wrapper.vm.coinsAvailableForChange[500]).toBe(5); 
        expect(wrapper.vm.coinsAvailableForChange[100]).toBe(5); 
        expect(wrapper.vm.coinsAvailableForChange[50]).toBe(5); 
        expect(wrapper.vm.coinsAvailableForChange[25]).toBe(5); 
    });

    it('should alert if machine lacks change', () => {
        // Arrange
        wrapper.setData({
            totalAmount: 1000,
            coinsUserHasInserted: {
                1000: 1,
                500: 1
            },
            coinsAvailableForChange: {
                500: 0,
                100: 0,
                50: 0,
                25: 1
            }
        });

        // Act
        wrapper.vm.CheckAmountUserPaid();

        // Assert
        expect(global.alert).toHaveBeenCalledWith('Fallo al realizar la compra. Sin suficientes fondos para el vuelto.');
    });

    it('should restore the stock of the coffees that were part of an order that was cancelled because of lack of change', () => {
        // Arrange
        wrapper.setData({
            totalAmount: 1200,
            coinsUserHasInserted: {
                1000: 1,
                100: 3
            },
            coinsAvailableForChange: {
                500: 0,
                100: 0,
                50: 0,
                25: 1
            },
            order: {
                Capuchino: 1
            },
            coffeeTypes: {
                Capuchino: {quantity: 0, price: 1200}
            }
        });

        // Act
        wrapper.vm.CheckAmountUserPaid();

        // Assert
        expect(wrapper.vm.coffeeTypes.Capuchino.quantity).toBe(1);
        expect(wrapper.vm.order.Capuchino).toBe(0);

    });

    it('should reset the machine state after operation', () => {
        // Arrange
        wrapper.setData({
            totalAmount: 1000,
            totalChange: 500,
            order: {
                Americano: 2,
                Capuchino: 1
            },
            coinsUserHasInserted: {
                1000: 1,
                500: 1,
                100: 1
            }, 
            coinsForChange: {
                100: 1
            }
        });

        // Act
        wrapper.vm.FinishOperation();

        // Assert
        expect(wrapper.vm.totalAmount).toBe(0);
        expect(wrapper.vm.totalChange).toBe(0);
        expect(wrapper.vm.order).toEqual({
            Americano: 0,
            Capuchino: 0,
            Late: 0,
            Mocachino: 0
        });
        expect(wrapper.vm.coinsUserHasInserted).toEqual({
            1000: 0,
            500: 0,
            100: 0,
            50: 0,
            25: 0
        });
        expect(wrapper.vm.coinsForChange).toEqual({
            500: 0,
            100: 0,
            50: 0,
            25: 0
        });
    });

    it('should calculate the amount of money the user paid correctly', () => {
        // Arrange
        wrapper.setData({
            coinsUserHasInserted: {
                1000: 1,
                500: 2,
                100: 3,
                50: 4,
                25: 5
            }
        });

        // Act & Assert
        expect(wrapper.vm.AmountUserPaid).toBe(1000 + 500 * 2 + 100 * 3 + 50 * 4 + 25 * 5); 
    });

    it('should calculate the amount of money available for change correctly', () => {
        // Arrange
        wrapper.setData({
            coinsAvailableForChange: {
                500: 2,
                100: 5,
                50: 10,
                25: 20
            }
        });

        // Act & Assert
        expect(wrapper.vm.AmountAvailableForChange).toBe(500 * 2 + 100 * 5 + 50 * 10 + 25 * 20); 
    });

    it('should get machine out of service if there are no more coins for change', () => {
        // Arrange
        wrapper.setData({
            machineOutOfService: false,
            coinsAvailableForChange: {
                500: 0,
                100: 0,
                50: 0,
                25: 0
            }
        });

        // Act
        wrapper.vm.CheckAmountOfCoinsForChange();

        // Assert
        expect(wrapper.vm.machineOutOfService).toBe(true); 
    });

    it('should get machine out of service if there are no more coffees available', () => {
        // Arrange
        wrapper.setData({
            machineOutOfService: false,
            coffeeTypes: {
                Americano: {quantity: 0, price: 950},
                Capuchino: {quantity: 0, price: 1200},
                Late: {quantity: 0, price: 1350},
                Mocachino: {quantity: 0, price: 1500}
            },
        });

        // Act
        wrapper.vm.CheckAmountOfCoffees();

        // Assert
        expect(wrapper.vm.machineOutOfService).toBe(true); 
    });
});