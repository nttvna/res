import ThermalPrinterModule from 'react-native-thermal-printer';
import Database from '../Database';

import { baseUrl } from '../const'
const db = new Database();

ThermalPrinterModule.defaultConfig.port = 9100;
ThermalPrinterModule.defaultConfig.autoCut = true;
ThermalPrinterModule.defaultConfig.timeout = 10000;
ThermalPrinterModule.defaultConfig.printerNbrCharactersPerLine = 47;//default: 42

const text: string =
    "[C]<u><font size='big'>ORDER N°045</font></u>\n" +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    '[L]<b>BEAUTIFUL SHIRT</b>[R]$9.99\n' +
    '[L]  + Size : S\n' +
    '[L]\n' +
    '[L]<b>AWESOME HAT</b>[R]$24.99\n' +
    '[L]  + Size : 57/58\n' +
    '[L]\n' +
    '[C]--------------------------------\n' +
    '[R]TOTAL PRICE :[R]$34.98\n' +
    '[R]TAX :[R]$4.23\n' +
    '[L]\n' +
    '[C]================================\n' +
    '[L]\n' +
    "[L]<font size='tall'>Customer :</font>\n" +
    '[L]John Smirt\n' +
    '[L]5105M Backlick Road Annandale, VA, USA\n' +
    '[L]Tel : +123456789\n' +
    '[L]\n' +
    "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n' +
    '[L]\n';


export const testPrinter = async (isTcp: boolean, ipAddress: string) => {
    try {
        if (isTcp) {
            if (!ipAddress || ipAddress.length < 10)
                return;

            ThermalPrinterModule.defaultConfig.ip = ipAddress;
            ThermalPrinterModule.printTcp({ payload: text })
        }
        else {
            await printBluetooth(text);
        }
    }
    catch (err) {
        console.log('testPrinter: ', testPrinter);
    }
}

const printBluetooth = async (contentPrint: string) => {
    try {
        
        ThermalPrinterModule.printBluetooth({
            payload: contentPrint
        })
        
    }
    catch { }

}

const checkOpenCashbox = (paymentType: string, OpenCashDrawer: number, isNewTransaction: boolean) => {
    //only open cashbox for new transaction
    if (isNewTransaction === false)
        return false;

    if (OpenCashDrawer === 0) {
        //Not Open All Time
        return false;
    }
    else if (OpenCashDrawer === 2) {
        //Open All Time
        return true;
    }
    else {
        //Open On Cash
        if (paymentType.indexOf('CASH') === -1)
            return false
        else
            return true;
    }
}

export const printContent = (content: string, paymentType: string, OpenCashDrawer: number, isNewTransaction: boolean) => {

    //Only log invoice template in developer
    // if (baseUrl !== 'https://res.ringameal.com') {
    //     console.log(`===============================Test printContent: ${paymentType}========================================`);
    //     console.log(content);
    //     return;
    // }


    try {
        db.getPrintSettingFromLocalDb().then(response => {
            const { IpAddress, PrintMode } = response;

            ThermalPrinterModule.defaultConfig.openCashbox = checkOpenCashbox(paymentType, OpenCashDrawer, isNewTransaction)
            if (PrintMode === 'tcp') {
                if (!IpAddress || IpAddress.length < 10)
                    return;

                ThermalPrinterModule.defaultConfig.ip = IpAddress;
                ThermalPrinterModule.printTcp({ payload: content })
            }
            else {
                printBluetooth(content);
            }
        });
    }
    catch (err) {
        console.log('printContent', err);
    }


}