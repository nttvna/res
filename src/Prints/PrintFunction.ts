import { OrderItem, orderDetailObj } from "../Models/order"
import { formatMoney, formatPhoneNumber } from "../common";
import { JsonDateFormat } from "../const";
import { printContent } from "./ThermalPrint"
import moment from 'moment';

const getFoodPrice = (item: OrderItem) => {
    if(item.Extras && item.Extras.length > 0){
        let priceFood: number = 0;
        for(let i:number = 0; i < item.Extras.length; i++){
            priceFood += (item.Extras[i].Price * 1) * item.Extras[i].Quantity
        }

        return formatMoney(priceFood * item.Quanlity);
    }
    else{
        return formatMoney(item.FoodPrice * item.Quanlity)
    }
}

export const printReceipt = (data: orderDetailObj | undefined) => {
    if(data){
        let orderType: string = data.Type == "PK" ? "Pick-up" : "Delivery";
        let paymentType: string = data.PaymentType === 'Pay later' ? 'Restaurant to collect payment' : 'Order pay in full';
        let resAddress: string = data.ShortAddress ? data.ShortAddress : data.ResAddress;
        const headerTicket: string = "[C]<font size='big'><b>Ring A Meal</b></font>\n\n" +
            "[C]<b>" + orderType + "</b>\n" +
            "[C]" + paymentType + "\n[L]\n" +
            "[C]<font size='big'><b>#" + data.OrderCode + "</b></font>\n" + 
            "[C]<b>" + data.CusName + "</b>\n" +
            "[C]-----------------------\n" +
            "[C]<font size='tall'><b>" + data.ResName + "</b></font>\n" +
            "[C]" + resAddress + "\n" +
            "[C]" + formatPhoneNumber(data.ResPhone) + "\n[L]\n[L]\n" +
            "[L]Date: <b>"+ moment(data.OrderTime, JsonDateFormat).format('l') +"</b>[R]Time:<b>" + moment(data.OrderTime, JsonDateFormat).format('LT') + "</b>\n";

        let orderItems: string = '';
        for(let i: number = 0; i < data.OrderItems.length; i++){
            orderItems += '[L]-----------------------------------------------\n';
            orderItems += "[L]" + data.OrderItems[i].Quanlity + "  <b>" + data.OrderItems[i].FoodName + "</b>[R]" + getFoodPrice(data.OrderItems[i]) + "\n";
            if(data.OrderItems[i].Extras){
                //food extras
                for(let j: number = 0; j < data.OrderItems[i].Extras.length; j++){
                    orderItems += "[L]   - " + data.OrderItems[i].Extras[j].Name + " (x" + data.OrderItems[i].Extras[j].Quantity + ")\n";
                }
            }
            
        }

        let printTemplate: string = headerTicket + orderItems;

        printTemplate += "[L]------------------------------------------------\n";
        printTemplate += "[R]SubTotal:[R]<b>" + formatMoney(data.SubTotal) + "</b>\n";
        if(data.Tip > 0){
            printTemplate += "[R]Tip:[R]<b>" + formatMoney(data.Tip) + "</b>\n";    
        }
        printTemplate += "[R]Tax:[R]<b>" + formatMoney(data.Tax) + "</b>\n";
        printTemplate += "[R]Total:[R]<b>" + formatMoney(data.Total) + "</b>\n";

        if(data.ResNote){
            printTemplate += '\n[L](*) ' + data.ResNote + '\n'
        }

        printContent(printTemplate + "[L]\n[L]\n[L]\n", 'CASH', 0, false);
    }
    
}