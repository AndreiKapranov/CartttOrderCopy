/**
 * Created by andrey on 8/19/24.
 */
import {LightningElement, track} from 'lwc';
import createCartApexMethod
    from '@salesforce/apex/CartController.createCartApexMethod';
import getBuyers
    from '@salesforce/apex/CartController.getBuyers';
import getCartStatusPicklistValuesUsingApex
    from '@salesforce/apex/CartController.getCartStatusPicklistValuesUsingApex';
import {genericShowToast} from "c/utils";


export default class NewCart extends LightningElement {

    genericShowToast = genericShowToast.bind(this);

    @track statusPicklistValues;
    isLoading = true;
    buyers = [];
    buyerId;
    estimatedDeliveryDate;
    pickupPointAddress;
    status;
    cartJsonObject = {};
    cartObject;
    cartId;
    pickupPointAddressValid = false;


    displayGoodSearchInBase() {

        this.dispatchEvent(new CustomEvent('switchtoselectgood', {
            detail: {
                'componentToDisplay': 'SelectGood',
                'cartId': this.cartId
            }
        }));
    }


    connectedCallback() {
        this.isLoading = true;
        getBuyers()
            .then(result => {
                this.buyers = result;
                console.log('result    :' + JSON.stringify(result));
                this.buyerId = this.buyers[0]['Id'];
                console.log('this.buyerId: ', this.buyerId);
                console.log('this.buyers: ', this.buyers);
            })
            .catch(error => {
                console.log(error);
                console.log('error getting Buyers');
                this.genericShowToast('error getting Buyers', error.body.message, 'error');
            });

        getCartStatusPicklistValuesUsingApex()

            .then(result => {

                this.statusPicklistValues = result;
                this.status = result[0]['value'];
                console.log('this.status: ', this.status);
                console.log('this.statusPicklistValues: ', JSON.stringify(this.statusPicklistValues));
            })
            .catch(error => {
                console.log(error);
                console.log('error getting Status Picklist values');
                this.genericShowToast('Error getting PickList values', error.body.message, 'error');
            })

        this.isLoading = false;
    }

    handleChangeBuyer(e) {
        this.buyerId = e.target.value;
    }

    handlePickupPointAddressChange(e) {

        let target = e.target;
        this.pickupPointAddress = e.target.value;
        console.log('pickupPointAddress = ' + this.pickupPointAddress);
        console.log(this.pickupPointAddress.includes(` `));
        const isWhitespaceString = str => !str.replace(/\s/g, '').length;

        if (isWhitespaceString(this.pickupPointAddress) || this.pickupPointAddress === '') {
            target.setCustomValidity('Complete this field.');
            this.pickupPointAddressValid = false;
        } else {
            target.setCustomValidity('');
            this.pickupPointAddressValid = true;
        }
    }

    handleStatusChange(e) {
        this.status = e.target.value;
    }

    createCartApexMethod() {
        if (this.pickupPointAddressValid) {
            this.isLoading = true;
            this.cartJsonObject.buyerId = this.buyerId;
            this.cartJsonObject.estimatedDeliveryDate = this.estimatedDeliveryDate;
            this.cartJsonObject.pickupPointAddress = this.pickupPointAddress;
            this.cartJsonObject.status = this.status;

            this.paramsJSONString = JSON.stringify(this.cartJsonObject);
            console.log('paramsJSONString:' + this.paramsJSONString);

            createCartApexMethod(
                {
                    paramsJSONString: this.paramsJSONString
                })
                .then(result => {
                    console.log(result);
                    console.log('ID: ', result.Id);
                    this.cartObject = result;
                    this.cartId = result.Id;

                    console.log('cartObject = ' + this.cartObject);
                    console.log('cartId = ' + this.cartId);

                    this.genericShowToast('Success!', 'Cart Record is created Successfully!', 'success');
                    this.displayGoodSearchInBase();
                })
                .catch(error => {
                    console.log('error createCart');
                    console.log(error);
                    this.genericShowToast('Error creating Cart.', error.body.message, 'error');
                }).finally(
                () => {
                    this.isLoading = false;
                }
            )
        } else {
            this.genericShowToast('Error creating New Cart.', 'Please, complete required fields properly', 'error');
        }
    }
}