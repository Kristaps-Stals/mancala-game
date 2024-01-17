<template>
  <div class="fromleft  absolute w-full h-full">
    <div class="absolute w-full h-full" :class="{ todown100: downAnimation }"> 

      <!-- WEBPAGE CONTAINER -->
      <div class="anchor-center absolute top-1/2 left-1/2 bg-white overflow-auto defaulttext" style="height:80%; width:80%"> 
        
        <figure class="float-left">
          <img src="../assets/catpicture.png" style="width:auto; height:300px;">
          <figcaption>artist: ElManuOrtiz</figcaption>
        </figure>

        <p>
          Hellow wwelcome to my website ! :333<br>
          &lt;----- this image has the float left css property 😊
        </p>

        <h1 class="text-3xl font-bold">MY LIST</h1>
        <ol id="ordered-list-secret">
          <li>This is the 1st list object!</li>
        </ol>
        <button id="add-button-secret" class="defaultbutton" @click="addOrderedListObject">
          add item to list
        </button>
        
        <p><br></p>

        <h1 class="text-3xl font-bold">AND THIS IS MY UNORDERED LIST</h1>
        <ul>
          <li>HI</li>
          <li>THIS</li>
          <li>CHAOTIC</li>
          <li>LIST</li>
          <li>IS</li>
          <li>UNORDERED</li>
          <li>BECAUSE</li>
          <li>IS</li>
          <li>IT</li>
        </ul>

        <p><br></p>

        <h1 class="text-3xl font-bold">FEEDBACK FORM</h1>
        <form id="feedback-form" action="https://www.w3schools.com/action_page.php" onsubmit="return false" @submit="validateForm">
          <label for="feedback-text">Feedback: </label>
          <input id="feedback-text" name="feedback-text" class="border border-black rounded" type="text">
          <br>
          <label for="fav-number">Your favorite number: </label>
          <input id="feedback-number" name="fav-number" class="border border-black rounded" type="number">
          <br>
          <input class="defaultbutton" type="submit">
        </form>

      </div>
      <!-- END OF WEBPAGE COTAINER -->

      <!-- Exit button -->
      <div class="absolute flex gameAnimCloseButton" style="top:-7%; width:12.5%;height:25%;left:88.75%;animation-delay: 10s;">
        <button class="btn-red m-auto w-1/2 h-1/4 text-4xl exit-button" @click="backToSettings">EXIT</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  data (){
    return {
      downAnimation: false,
      numbersGuessed: [],
    }
  },

  // mounted() {
  //   for (var i = 0; i < 1020; i++){
  //     this.addOrderedListObject()
  //   }
  // },

  methods: {
    backToSettings() {
      this.disappearAnimation()
      this.$emit('back')
    },

    disappearAnimation(){
      this.downAnimation = true
      setTimeout(() => { // fail safe for going too fast
        this.downAnimation = false
      }, 600)
    },

    calcSuffix(pos){
      if (pos > 10 && pos < 20) return "th"
      if (pos%10 == 1) return "st"
      if (pos%10 == 2) return "nd"
      if (pos%10 == 3) return "rd"
      return "th"
    },

    genText(pos){
      if (pos == 3) return "3 is a crowd"
      if (pos == 5) return "5 is the only prime number that has a sum of two consecutive prime numbers (2 + 3 = 5)"
      if (pos == 10) return "The 10th element? thats a lot of elements!"
      if (pos == 15) return "Keep going!"
      if (pos == 25) return "You can do it!"
      if (pos == 50) return "This list is getting long..."
      if (pos == 69) return "Nice"
      if (pos == 75) return "Having to scroll makes this really annoying"
      if (pos == 100) return "Patience is the road to wisdom"
      if (pos == 102) return "Or something like that"
      if (pos == 150) return "You really think there is something at the end?"
      if (pos == 200) return "There might be :3"
      if (pos == 250) return "But if I give you a message once in a while, you will think there is more and keep going, right?"
      if (pos == 275) return "But don't get discouraged if I'm a bit quiet at times... I'm not very goot at talking :( (somtimes)"
      if (pos == 420) return "You expect the messages to be on nice and round numbers..."
      if (pos == 501) return "But that isnt always the case :)"
      if (pos == 600) return "It's lonely all the way out here..."
      if (pos == 690) return "There is nothing to gain from doing this..."
      if (pos == 700) return "1% of the way there!!"
      if (pos == 710) return "Almost there!"
      if (pos == 800) return "The next one could be the one!"
      if (pos == 801) return "Ooooh, so close"
      if (pos == 802) return "Yet so far"
      if (pos == 900) return "The big one is coming!"
      if (pos == 1000) return "You thought it would end here, didn't you :)"
      if (pos == 1030) return "OKOK just kidding, you win! here is a virtual hug :D 🤗🤗🤗🤗🤗🤗"
      return "This is the " + pos + this.calcSuffix(pos) + " list object!"
    },

    addOrderedListObject(){
      var ol_object = document.getElementById("ordered-list-secret")
      var current_amount = ol_object.children.length
      current_amount += 1

      if (current_amount >= 1031) {
        var button_obj = document.getElementById("add-button-secret")
        button_obj.innerHTML = "OK THATS ENOUGH"
        return
      }

      var objadd = document.createElement("li");
      objadd.innerHTML = this.genText(current_amount); 

      ol_object.appendChild(objadd)
    },

    validateForm(){
      var myForm = document.getElementById("feedback-form")
      var feedbackText = document.getElementById("feedback-text").value
      var feedbackNumber = Number(document.getElementById("feedback-number").value)

      if (feedbackText == ""){
        alert("feedback text should not be empty!")
        return
      }

      // console.log(this.numbersGuessed.length)
      // return 

      if (feedbackNumber != 42){
        
        var guessed = false
        var siz = this.numbersGuessed.length

        for (var i = 0; i < siz; i++){
          if (this.numbersGuessed[i] == feedbackNumber) guessed = true;
        }

        if (guessed){
          alert("You already chose this number! >:(")
          return
        }
        
        this.numbersGuessed.push(feedbackNumber)
        siz += 1

        if (siz == 1) alert(feedbackNumber + " is not a valid favorite number!") 
        if (siz == 2) alert(feedbackNumber + " is ALSO not a valid favorite number!") 
        if (siz == 3) alert(feedbackNumber + " is VERY MUCH not a valid favorite number! (hint: 42 is a valid favorite number to have)") 
        if (siz == 4) alert(feedbackNumber + " is a bad number, 42 is so much better, don't you agree?") 
        if (siz == 5) alert(feedbackNumber + " != 42")
        if (siz >= 6){
          var s = "";
          for (var i = 6; i <= siz; i++){
            s += "42 "
          }
          alert(s)
        } 
        return
      }

      myForm.submit()
    }
    
  },

}
</script>

<style>

</style>