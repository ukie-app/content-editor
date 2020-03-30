const admin = require('firebase-admin');

let serviceAccount = require('./ukie-test-645eb0f78aef.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

var json = require('../ukie-data/firestoreData.json');

//console.log(data)

// for (var collection in json) {
//     console.log(collection)
//     for (var doc in json[collection]) {
//         console.log(doc)
//         for (var data in json[collection][doc]) {
//             console.log(data)
//             for (var info in json[collection][doc][data]) {
//                 console.log(info)
//             }
//         }
//     }
// }

Object.entries(json).map(collection => {
  //console.log(collection[0])
  //if(collection[0] === "courses") {
  Object.entries(collection[1]).map(doc => {
    //console.log(doc[0])
    //console.log(doc[1])
    let updateDoc = db.collection(collection[0]).doc(doc[0]);
    updateDoc.set({}).then(something => {
      Object.entries(doc[1]).map(data => {
        //console.log("this is: ")
        //console.log(data[0])
        //console.log(data[1])
        if(typeof(data[1]) === "object") {
          //console.log("is object")
          //console.log(data[1])
          Object.entries(data[1]).map(arr => {
            //console.log(arr[0])
            //console.log(arr[1])
            let dbData = {
            };
            Object.entries(arr[1]).map(final => {
              //console.log(final[0])
              //console.log(final[1])


              dbData[`${final[0]}`] = final[1]
            }
            )
            let tmp = {
            };
            tmp[`${data[0]}`] = admin.firestore.FieldValue.arrayUnion(dbData)
            //console.log("this is what I want to see:" ,tmp)
            console.log("dbData", dbData)
            console.log("data", data[0])
            console.log("doc", doc[0])
            console.log("this is what I want to see:" ,tmp)
            updateDoc.update(tmp);
          }
          )
      }
      else {
        let tmp = {
        };
        tmp[`${data[0]}`] = data[1]
        updateDoc.update(tmp);
      }
      }
      )
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }
  )
//}
}
)
