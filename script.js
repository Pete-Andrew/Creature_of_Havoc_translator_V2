const backgroundImage = document.getElementById("backgroundImage");

let ImageToTextButton = document.getElementById('imageToText'); 
let inputTextBox = document.getElementById('inputSentence'); 

document.getElementById('inputSentence').style.height="200px";
document.getElementById('inputSentence').style.fontSize="14pt";

document.getElementById('outputSentence').style.height="200px";
document.getElementById('outputSentence').style.fontSize="14pt";

let image;

// Global variable to store the image URL
let uploadedImageUrl = "";

//create a box for API key (and make a gitignore for API)
// take a photo and add it to local storage AND/OR add a photo from phone settings


// uploads the image as either a drag and drop or an open file
    function uploadImage(file) {
      let imgLink = URL.createObjectURL(file);
      backgroundImage.style.backgroundImage = `url(${imgLink})`;
  }

  inputFile.addEventListener("change", function () {
      if (this.files.length > 0) {
          uploadImage(this.files[0]);
      }
  });

      // get the size of the imported image
      function getSize() {
        $("#inputFile").change(function (e) {
            var file, img;

            if ((file = this.files[0])) {
                img = new Image(); //Image() constructor creates a new HTMLImageElement instance. It is functionally equivalent to document.createElement('img').
                img.onload = function () {

                    imgWidth = this.width;
                    imgHeight = this.height;
                    // imgPath =
                    // logs out the size of the imported im in px
                    console.log("raw imported Width of img (imgWidth) in px = " + imgWidth);
                    console.log("raw imported Height of img (imgHeight) in px = " + imgHeight);
                };

                img.onerror = function () {
                    alert("not a valid file: " + file.type);
                };

                // Log the name of the uploaded file
                // console.log("Name of the uploaded image: " + file.name);
                img.src = URL.createObjectURL(file); //Each time you call createObjectURL(), a new object URL is created called file.
                imgLoaded = true;
                console.log("image loaded = " + imgLoaded);
                console.log(img.src)

                // Store the image URL in the global variable
                uploadedImageUrl = img.src;
            }
        });
    };
    getSize();

//Pass the photo to tesseract to turn the text into images
//Tesseract is loaded by a CDN link in the index html

ImageToTextButton.addEventListener("click", useTesseract);

function useTesseract () {
//clear the inputText area text (if any)
inputTextBox.value = '';
//runs the tesseract function
console.log("tesseract has been called");
let language = 'eng';
image = uploadedImageUrl;
// image = file.name;

Tesseract.recognize(
  image,language,
  { 
    // logger console's out the tesseract process, can be commented out. 
    // logger: m => console.log(m) 
  }
)
.catch (err => {
  console.error("There has been an error = " + err);
})
//opens the resulting object and console logs the out put
.then(({ data: { text } }) => {
  // pass the output text into the input text box
  console.log(text);
  inputTextBox.value = text;
})
}


// output the text so it can be cropped to just the coded text



// decoder wraps all the function
function decoder () {

// gets the string from the inputsentence input box
var inputString = document.getElementById("inputSentence").value;
console.log("input String = " + inputString)
// outputArray is the string that has been turned into an array
var outputArray = [];
//translated String = vowels have been turned into spaces, these will eventually become spaces
var translatedString = [];
//nospaceString = white space has been removed
var noSpaceString = [];

//turns the original string into an array
function stringToArray (inputString) { 
	for (i=0; i < inputString.length; i++) {
      
   outputArray.push(inputString.charAt(i));  
   }
}

stringToArray(inputString); 
console.log("Decoder: stringToArray: the string has been turned into an array = " + outputArray); 

//replaces vowels with * that will represent blank space.
function replaceVowels (outputArray) { 
	for (i=0; i < outputArray.length; i++) {
  	if (outputArray[i] == "a") {
        translatedString.push("*")
        i++;}
		if (outputArray[i] == "e") {
        translatedString.push("*") 
        i++;}
    if (outputArray[i] == "i") {
        translatedString.push("*")
        i++;}
    if (outputArray[i] == "o") {
        translatedString.push("*")
        i++;}
    if (outputArray[i] == "u") {
        translatedString.push("*");
  			i++;}            
		if (outputArray[i] == ".") {
        translatedString.push(". ");
  			i++;}   
    
    else {
    		translatedString.push(outputArray[i]);
    }   
  }
}

 replaceVowels (outputArray); 
 console.log("Decoder: translatedString: word spaces have been replaced by asterisks = " + translatedString);
 
 //remove spaces
  function removeWhiteSpace () {
  	for (i=0; i < translatedString.length; i++) {
   			if (translatedString[i] == " ") {
         noSpaceString.push(); 
         }
         else { noSpaceString.push(translatedString[i]); 
       }
    }
 }
  
  removeWhiteSpace(); 
  console.log("Decoder: noSpaceString: white space removed = " + noSpaceString);
 
//adds vowels to relevant spaces, e replaces f etc.. 
//this causes problems as not all the consonants need replacing.  
 
function placeVowels (noSpaceString) { 
 
 		let modified = 
    noSpaceString.map(e => e
    .replace("f", "e")
    .replace("b", "a")
    .replace("j", "i")
    .replace("p", "o")
    .replace("v", "u") 
    .replace("*", " ")
    
    ); 
    
    console.log("Decoder: consonants have been replaced with appropriate vowels = " + modified); 
 		sortPunctuation(modified)
}
 
placeVowels(noSpaceString); 
 
function sortPunctuation (modified) {
          
          const finalString = modified
          .toString()
          .split(",")
          .join("")
                    
          console.log("Decoder: final decoded output = " + finalString);
          
          //takes the final string and puts it in the output box
          document.getElementById("outputSentence").value = finalString;

 }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function encoder () {
  
  var outputString = document.getElementById("outputSentence").value;
  var englishToTranslateString = outputString.split("");
  var vowelsReplaced = ""
  var vowelsReplacedArray = [];
  var vowelArray = ["a","e","i","o","u"];

  //remove exiting vowels from the string
  function removeVowels () {
    var vowelsReplaced = 
    englishToTranslateString.map(e => e
    .replace("e","f")
    .replace("a", "b")
    .replace("i", "j")
    .replace("o", "p")
    .replace("u", "v") 
        
    ); 
    
    console.log("Encoder: vowels have been replaced with appropriate consonants = " + vowelsReplaced); 
    replaceSpaceWithVowels(vowelsReplaced)
  }
  
  removeVowels (); 
  
//replace spaces with vowels - make a random vowel generator
  function replaceSpaceWithVowels (vowelsReplaced) { 
    for (i=0; i < vowelsReplaced.length; i++) {
      if (vowelsReplaced[i] == " ") {
        // this picks a random vowel from the vowels array.
        vowelsReplacedArray.push(vowelArray[Math.floor(Math.random() * 5)]);
        // blurb.push("a");
        }
        else { 
          vowelsReplacedArray.push(vowelsReplaced[i]);
          }
      console.log("this is working " + vowelsReplacedArray);
    }
  }
  
  replaceSpaceWithVowels(vowelsReplaced)

  //add random spaces
  //This next bit was written with the help of chat GTP to see if it could help me with coding. It did. 

  function addRandomBlankSpaces(array) {
    //creates a blank array to push the new array to
    const result = []; 
    // creates a boolean variable, assigns it false
    let prevIsSpace = false;

    //looks at the array. If there is not a space previously and math random gives a number < 0.25 then push a blank space to the array and set previous space to true
    //for loop is used for iterating over the sequence. In this case the vowelsReplacedArray. 
  for (const item of array) {     
    if (!prevIsSpace && Math.random() < 0.25) {
      result.push(" ");           // Add a blank space with a 25% probability
      prevIsSpace = true;         //sets the prevIsSpace to true so that the for loop won't add another space after an existing one. 
    }
    //if the above code doesn't generate a blank space 'result.push(item)' will push a letter from the existing array to the new one and reset the prevIsSpace to false
    //so a space can potentially be placed next time. 
    //prevIsSpace then made false again. 
    // this is NOT and if/else statement as the below code does not run as an alternative to the 'if' loop. 
    result.push(item);  
    prevIsSpace = false;
   
  }
  return result;
}

// creates a variable that equals the result of the 'addRandomBlankSpaced' function above with the 'vowelsReplacedArray' passed into it. 
var codeWithRandomSpaces = addRandomBlankSpaces(vowelsReplacedArray);

console.log("code with random spaces " + codeWithRandomSpaces);

   //convert the array to a string

  function convertedToCode () {
          
    const encodedFinalString = codeWithRandomSpaces
    .toString()
    .split(",")
    .join("")
              
    console.log("Decoder: final decoded output = " + encodedFinalString);
    document.getElementById("inputSentence").value = encodedFinalString;
  }
  convertedToCode();
}  
  
//--------------------------------------------------------------------------------------------------------------------------------------------------------

// run the output through Google Cloud Natural Language API or Microsoft Azure Cognitive Services - Spell Check API


/* Notes: 
 
There are three rules to this code: 
1. each vowel has been replaced by the following letter, e.g. b = a, f = e, etc...
2. exisitng vowels represent spaces
3. actual spaces are random and mean nothing

*/

//sometimes throws an error at line 84 ---> 

// Uncaught TypeError: Cannot read properties of undefined (reading 'replace')
//     at script.js:84:6
//     at Array.map (<anonymous>)
//     at placeVowels (script.js:83:19)
//     at decoder (script.js:97:2)
//     at HTMLButtonElement.onclick (main.html:53:33)

//Invaluable advice about tesseract: 
//https://www.youtube.com/watch?v=kHTasYqs4Tw&ab_channel=CodeRadiance
//https://github.com/naptha/tesseract.js#tesseractjs
