var config = {
    apiKey: "AIzaSyC8rEtUCYJ1R-KTLuotu9y7ncgIMB1Is2A",
    authDomain: "train-scheduler-36db0.firebaseapp.com",
    databaseURL: "https://train-scheduler-36db0.firebaseio.com",
    projectId: "train-scheduler-36db0",
    storageBucket: "train-scheduler-36db0.appspot.com",
    messagingSenderId: "781440168236",
    appId: "1:781440168236:web:b7543e64ed6e00b38bbc89",
    measurementId: "G-RGH5833BL2"
  };
  
  firebase.initializeApp(config);
  
  //Make var to call database
  var database = firebase.database();
  
  // ---------STORAGE------------->

//Var to push train names
  var trainsName = "";
//Var to push destination
  var destination = "";
//Var to push frequency
  var freqMin = "";
//Var to put next arrival time
  var firstTrain = "";
//Var to store time (in minutes)
  var minsAway = "";

  // ---------STORAGE------------->



  // --------DATABASE PUSH--------->

//OnClick submit button
  $("#submit-button").on("click", function (e) {
//Prevent repeats
    e.preventDefault();

    //the value of user input for trainName is = to the var ser up above same for destination freq and NA
     trainsName = $("#trainNameInput").val();
      destination = $("#destinationInput").val();
      freqMin = $("#freqInput").val();
      firstTrain = $("#firstTrainInput").val();

    //push it all to the database
     database.ref().push({
          trainsName: trainsName,
          destination: destination,
          freqMin: freqMin,
          firstTrain: firstTrain
     });
     $("#trainNameInput").val("");
     $("#destinationInput").val("");
     $("#freqInput").val("");
     $("#firstTrainInput").val("");
  });

  // --------DATABASE PUSH--------->


  //function runs on new child added
  database.ref().on("child_added", function(data){
      //make sure it works
      console.log(data.val());

      var tFrequency = data.val().freqMin
      var tFirstTrain = data.val().firstTrain

      //split our hours and minutes apart from eachother and store into new array
      var timeArr = tFirstTrain.split(":");
    //  console.log(timeArr, "this is time array");
      var tMinutes, tArrival;
      var firstTimeConverted = moment(tFirstTrain, "hh:mm").subtract(1, "years");
    //  console.log(firstTimeConverted, "this is time converted");
      var currentTime = moment();
    //  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    //  console.log("DIFFERENCE IN TIME: " + diffTime);
      var tRemainder = diffTime % tFrequency;
    //  console.log(tRemainder,  "this is t remainder");
      var tMinutesTillTrain = tFrequency - tRemainder;
    //  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    //  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
      $("#TrainNames").append(data.val().trainsName + "<hr>")

     //get the val of destination and append it to the destination
      $("#destination").append(data.val().destination + "<hr>")
      $("#frequency").append(data.val().freqMin + "<hr>")

      //get the val of nextArrival and append it to the NextArrival
      $("#firstTrain").append(data.val().firstTrain + "<hr>")

      //get the val of minsaway and append it to The minsAway
      $("#minsAway").append(tMinutesTillTrain + "<hr>")
      //
      $("#arivalTime").append(moment(nextTrain).format("hh:mm") + "<hr>")
  });