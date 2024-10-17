import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../Model/oder-model';


@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
    isProceess: boolean = true;
    data: Order[] = [];
    order: Order | undefined;

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadOrders(id);
            }
        });
    }

    loadOrders(id: any): void {
        this.order = history.state.order;
        this.isProceess = false;
    }
    steps = [
        { status: 'Order_Receipt', name: 'Order Receipt', icon: 'las la-check-circle' },
        { status: 'Confirmation', name: 'Confirmation', icon: 'las la-user-tie' },
        { status: 'In_transit', name: 'In Transit', icon: 'las la-shuttle-van' },
        { status: 'Delivered', name: 'Delivered', icon: 'las la-thumbs-up' }
    ];

    calculateAmount(price: string, quantity: number): number {
        const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ''));
        return numericPrice * quantity;
    }

    // Method to calculate Subtotal
    getSubtotal(): number {
        return (this.order!.orderProducts as any[]).reduce((total: number, item: any) =>
            total + this.calculateAmount(item.price, item.quantity), 0);
    }

    getTotalAmount(): number {
        const subtotal = this.getSubtotal();
        // Assuming CGST and SGST are calculated percentages of the subtotal
        // const cgst = subtotal * 0.09; // Example: 9% CGST
        // const sgst = subtotal * 0.09; // Example: 9% SGST
        const cgst = subtotal * 0.0; // Example: 9% CGST
        const sgst = subtotal * 0.0; // Example: 9% SGST
        return subtotal + cgst + sgst;
    }

    getStepClass(status: string): string {
        const trackStatus = this.order?.orderStatus;
        const steps = this.steps ?? [];

        if (trackStatus === status) {
            return 'finish'; // Current step
        } else if (steps.length > 0) {
            const currentStepIndex = steps.findIndex(step => step.status === trackStatus);
            const targetStepIndex = steps.findIndex(step => step.status === status);

            if (currentStepIndex !== -1 && targetStepIndex !== -1) {
                // Mark steps before the current step as 'finish'
                if (targetStepIndex < currentStepIndex) {
                    return 'finish';
                }
                // Mark steps after the current step as 'inactive'
                else if (targetStepIndex > currentStepIndex) {
                    return 'inactive';
                }
            }
        }
        return 'inactive'; // Default for steps that don't match
    }






}
