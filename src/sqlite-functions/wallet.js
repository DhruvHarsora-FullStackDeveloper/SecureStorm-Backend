import SQLite from 'react-native-sqlite-storage'

const db = SQLite.openDatabase({
    name:"SecureStorm"
},()=>{},error => {
    console.log(error)
})

export const createTable=()=>{
    db.transaction((tx)=>{
        tx.executeSql(
        "CREATE TABLE IF NOT EXISTS"
        +"wallet "
        +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, app_name TEXT, app_id TEXT, password TEXT)"
        )
    })
}

export const InsertData = (app_name, app_id, password)=>{
    db.transaction( async (tx)=>{
        await tx.executeSql(
            "INSERT INTO wallet (app_name,app_id,password)"
            +" VALUES (?,?,?)",
            +[app_name, app_id, password])
    })
}

export const ShowPassword = (app_id,(tx)=>{
    const result={
       password
    };
    tx.executeSql(
        "SELECT password FROM wallet"
        +"where app_id = (?)",
        [app_id],
        [],
        (tx,results)=>{
            let len = results.rows.length;
            if(len>0){
                result.password = result.rows.item(0).password;
                return result;  
            }
        }
    )
})

export const ShowData = ((tx)=>{
    const result={
        app_name,
        app_id,
        
    };
    tx.executeSql(
        "SELECT app_name,app_id FROM wallet",
        [],
        (tx,results)=>{
            let len = results.rows.length;
            if(len>0){
                result.app_name = result.rows.item(0).app_name;
                result.app_id = result.rows.item(0).app_id;
                return result;  
            }
        }
    )
})