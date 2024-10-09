import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(false);
SQLite.enablePromise(true);

const database_name = "BjpRestaurant.db";


export default class Database {
    // //DeviceType: POS|CLIENT
    // settingDeviceLogin(DeviceId, ComId, IsPOS) {
    //     let DeviceType = IsPOS == true ? 'POS' : 'CLIENT';
    //     let CustomerPayment = 'NO';
    //     return new Promise((resolve) => {
    //         SQLite.openDatabase(database_name).then((db) => {
    //             db.transaction((tx) => {
    //                 tx.executeSql(`DELETE FROM DeviceSetting`);
    //                 tx.executeSql(`INSERT INTO DeviceSetting (DeviceId, ComID, DeviceType,CustomerPayment)
    //                                 VALUES ('${DeviceId}', '${ComId}', '${DeviceType}', '${CustomerPayment}')`)
    //                     .then(([tx, results]) => {
    //                         resolve(results);
    //                     });
    //             }).then((result) => {
    //                 this.closeDatabase(db);
    //             }).catch((err) => {
    //                 console.log(err);
    //             });
    //         }).catch((err) => {
    //             console.log(err);
    //         });
    //     });
    // }

    // updateLocalSetting(FontSize, PrintType, PrintMode, IpAddress, IsCustomerPayment) {
    //     let CustomerPayment = IsCustomerPayment == true ? 'YES' : 'NO';
    //     return new Promise((resolve) => {
    //         SQLite.openDatabase(database_name).then((db) => {
    //             db.transaction((tx) => {
    //                 tx.executeSql(`UPDATE  DeviceSetting SET CustomerPayment='${CustomerPayment}'`);
    //                 tx.executeSql(`DELETE FROM PrintSetting`);
    //                 tx.executeSql(`INSERT INTO PrintSetting(FontSize, PrintType, PrintMode, IpAddress)
    //                                 VALUES('${FontSize}', '${PrintType}', '${PrintMode}', '${IpAddress}')`)
    //                     .then(([tx, results]) => {
    //                         resolve(results);
    //                     });

    //             }).then((result) => {
    //                 this.closeDatabase(db);
    //             }).catch((err) => {
    //                 console.log(err);
    //             });
    //         }).catch((err) => {
    //             console.log(err);
    //         });
    //     });
    // }

    // getDeviceLoginInfo() {
    //     return new Promise((resolve) => {
    //         SQLite.openDatabase(database_name).then((db) => {
    //             db.transaction((tx) => {
    //                 tx.executeSql('SELECT DeviceId, ComID, DeviceType,CustomerPayment FROM DeviceSetting LIMIT 1', []).then(([tx, results]) => {
    //                     let setting = { ...results.rows.item(0) };
    //                     if (Object.keys(setting).length === 0) {
    //                         resolve({
    //                             DeviceId: "",
    //                             ComID: "",
    //                             DeviceType: "",
    //                             CustomerPayment: ""
    //                         });
    //                     }
    //                     else
    //                         resolve(setting);
    //                 });
    //             }).then((result) => {
    //                 this.closeDatabase(db);
    //             }).catch((err) => {
    //                 resolve({
    //                     DeviceId: "",
    //                     ComID: "",
    //                     DeviceType: "",
    //                     CustomerPayment: ""
    //                 });
    //             });
    //         }).catch((err) => {
    //             console.error('getDeviceLoginInfo: ', err);
    //             resolve({
    //                 DeviceId: "",
    //                 ComID: "",
    //                 DeviceType: "",
    //                 CustomerPayment: ""
    //             });
    //         });
    //     });
    // }

    settingPrint(PrintMode, IpAddress, OpenCashBox = 'False') {
        return new Promise((resolve) => {
            SQLite.openDatabase(database_name).then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`DELETE FROM PrintSetting`);
                    tx.executeSql(`INSERT INTO PrintSetting(PrintMode, IpAddress, OpenCashBox)
                                    VALUES('${PrintMode}', '${IpAddress}', '${OpenCashBox}')`)
                        .then(([tx, results]) => {
                            resolve(results);
                        });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    getPrintSettingFromLocalDb() {
        return new Promise((resolve) => {
            SQLite.openDatabase(database_name).then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT PrintMode, IpAddress, OpenCashBox FROM PrintSetting LIMIT 1', []).then(([tx, results]) => {
                        let setting = { ...results.rows.item(0) };
                        if (Object.keys(setting).length === 0) {
                            resolve({
                                PrintMode: "bluetooth",
                                IpAddress: "",
                                OpenCashBox: "false"
                            });
                        }
                        else
                            resolve(setting);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.error('getPrintSettingFromLocalDb: ', err);
                    resolve({
                        PrintMode: "bluetooth",
                        IpAddress: "",
                        OpenCashBox: "false"
                    });
                });
            }).catch((err) => {
                console.error('getPrintSettingFromLocalDb: ', err);
                resolve({
                    PrintMode: "bluetooth",
                    IpAddress: "",
                    OpenCashBox: "false"
                });
            });
        });
    }

    settingRestaurant(AutoPrint) {
        return new Promise((resolve) => {
            SQLite.openDatabase(database_name).then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`DELETE FROM RestaurantSetting`);
                    tx.executeSql(`INSERT INTO RestaurantSetting(AutoPrint)
                                    VALUES('${AutoPrint}')`)
                        .then(([tx, results]) => {
                            resolve(results);
                        });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    getRestaurantSettingFromLocalDb() {
        return new Promise((resolve) => {
            SQLite.openDatabase(database_name).then((db) => {
                db.transaction((tx) => {
                    tx.executeSql('SELECT AutoPrint FROM RestaurantSetting LIMIT 1', []).then(([tx, results]) => {
                        let setting = { ...results.rows.item(0) };
                        if (Object.keys(setting).length === 0) {
                            resolve({
                                AutoPrint: "False"
                            });
                        }
                        else
                            resolve(setting);
                    });
                }).then((result) => {
                    this.closeDatabase(db);
                }).catch((err) => {
                    resolve({
                        AutoPrint: "False"
                    });
                });
            }).catch((err) => {
                resolve({
                    AutoPrint: "False"
                });
            });
        });
    }


    initAppDatabase() {
        let db;
        return new Promise((resolve) => {

            SQLite.openDatabase(database_name)
                .then(DB => {
                    db = DB;
                    //init table print setting
                    db.executeSql('SELECT 1 FROM PrintSetting LIMIT 1').then(() => { }).catch((error) => {
                        db.transaction((tx) => {
                            tx.executeSql('CREATE TABLE IF NOT EXISTS PrintSetting (PrintMode TEXT, IpAddress TEXT, OpenCashBox TEXT)');
                        });
                    });
                    //init table device login
                    db.executeSql('SELECT 1 FROM RestaurantSetting LIMIT 1').then(() => { }).catch((error) => {
                        db.transaction((tx) => {
                            tx.executeSql('CREATE TABLE IF NOT EXISTS RestaurantSetting (AutoPrint TEXT)');
                        });
                    });
                    // //init table device login
                    // db.executeSql('SELECT CustomerPayment FROM DeviceSetting LIMIT 1').then(() => { }).catch((error) => {
                    //     db.transaction((tx) => {
                    //         tx.executeSql('ALTER TABLE DeviceSetting ADD COLUMN CustomerPayment TEXT');
                    //         tx.executeSql('UPDATE  DeviceSetting SET CustomerPayment=?', 'NO');
                    //     });
                    // });

                    resolve(db);
                })
                .catch(error => {
                    console.log('OPEN DB ERROR: ', error);
                });
        });
    };

    closeDatabase(db) {
        if (db) {
            db.close()
                .then(status => {
                    //console.log("Database CLOSED");
                })
                .catch(error => {
                    //console.log('CLOSE DB ERROR: ', error);
                });
        }
    };
}