import { shallowMount } from '@vue/test-utils';
import CoffeeMachine from '@/components/CoffeeMachine.vue';

describe('CoffeeMachine.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(CoffeeMachine);
        global.alert = jest.fn();
    });

    it('should add coffee to order if quantity is valid', () => {
        wrapper.setData({
            selectedCoffee: 'Americano',
            selectedQuantity: 2,
            coffeeTypes: {
                Americano: { quantity: 10, price: 950 }
            }
        });

        wrapper.vm.AddCoffeeToOrder('Americano', 2);

        expect(wrapper.vm.order.Americano).toBe(2);
        expect(wrapper.vm.coffeeTypes.Americano.quantity).toBe(8); // 10 - 2
        expect(wrapper.vm.totalAmount).toBe(1900); // 950 * 2
    });

    it('should not add coffee if quantity exceeds stock', () => {
        wrapper.setData({
            selectedCoffee: 'Americano',
            selectedQuantity: 12,
            coffeeTypes: {
                Americano: { quantity: 10, price: 950 }
            }
        });

        wrapper.vm.AddCoffeeToOrder('Americano', 12);

        expect(wrapper.vm.order.Americano).toBe(0); // No se agregó
        expect(wrapper.vm.coffeeTypes.Americano.quantity).toBe(10); // Sin cambios
        expect(wrapper.vm.totalAmount).toBe(0);
    });


    it('should alert if user paid insufficient amount', () => {
        wrapper.setData({
            totalAmount: 1000,
            coinsUserHasInserted: {
                1000: 0,
                500: 1, // 500 colones
                100: 0,
                50: 0,
                25: 0
            }
        });

        wrapper.vm.CheckAmountUserPaid();

        expect(global.alert).toHaveBeenCalledWith('Cantidad insuficiente!');
    });

    it('should calculate change if user overpaid', () => {
        wrapper.setData({
            totalAmount: 1000,
            coinsUserHasInserted: {
                1000: 1, // 1000 colones
                500: 1  // Total 1500
            },
            coinsAvailableForChange: {
                500: 5, // Hay suficiente cambio
                100: 0,
                50: 0,
                25: 0
            }
        });

        wrapper.vm.CheckAmountUserPaid();

        expect(wrapper.vm.totalChange).toBe(500);
        expect(wrapper.vm.coinsForChange[500]).toBe(1);
    });

    it('should alert if machine lacks change', () => {
        wrapper.setData({
            totalAmount: 1000,
            coinsUserHasInserted: {
                1000: 1,
                500: 1
            },
            coinsAvailableForChange: {
                500: 0, // Sin cambio disponible
                100: 0,
                50: 0,
                25: 0
            }
        });

        wrapper.vm.CheckAmountUserPaid();

        expect(global.alert).toHaveBeenCalledWith('Fallo al realizar la compra. Sin suficientes fondos para el vuelto.');
        expect(wrapper.vm.totalChange).toBe(0);
    });

    it('should reset the machine state after operation', () => {
        wrapper.setData({
            totalAmount: 1000,
            totalChange: 500,
            order: {
                Americano: 2,
                Capuchino: 1
            },
            coinsUserHasInserted: {
                1000: 1,
                500: 1
            }
        });

        wrapper.vm.FinishOperation();

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
    });

    it('should calculate AmountUserPaid correctly', () => {
        wrapper.setData({
            coinsUserHasInserted: {
                1000: 1,
                500: 2,
                100: 3,
                50: 4,
                25: 5
            }
        });

        expect(wrapper.vm.AmountUserPaid).toBe(1000 + 500 * 2 + 100 * 3 + 50 * 4 + 25 * 5); // 1975
    });

    it('should calculate AmountAvailableForChange correctly', () => {
        wrapper.setData({
            coinsAvailableForChange: {
                500: 2,
                100: 5,
                50: 10,
                25: 20
            }
        });

        expect(wrapper.vm.AmountAvailableForChange).toBe(500 * 2 + 100 * 5 + 50 * 10 + 25 * 20); // 1750
    });
});