const inputSlider = document.querySelector("[data-lengthSlider]"); 
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copybtn= document.querySelector("[data-copy]");
const copymsg= document.querySelector('[data-copyMsg]');
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numberCheck= document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generateBtn");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols='~@!#$%^&*(){}[]=`:"<>?/.,;+-';

let password ="";
let passwordLength = 18;
let checkcount =0;
handleSlider();//iska kaam h ki password length ko ui pr reflect   krwata h
//set circle color to grey
setIndicator('#ccc');


function handleSlider(){
     inputSlider.value=passwordLength;
     lengthDisplay.innerText= passwordLength;
     const min=inputSlider.min;
     const max=inputSlider.max;
     inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"%100%" ;
}


function setIndicator(color){
     indicator.style.backgroundColor = color;
     //shadow v dalni h
     indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min , max){
   return Math.floor(Math.random()*(max-min))+min;
}    

function generateRandomNumber(){
    return getRandomInteger(0,10).toString();
}
function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));//97=lowercase a ki ascii value and 123=lowercase z ki ascii value
}
function generateUpperCase(){
     return String.fromCharCode(getRandomInteger(65,91));
}
function generateSymbols(){
      const randNum=getRandomInteger(0,symbols.length);
      return symbols.charAt(randNum);//symbol string me se is index ki value de dega 
}

function calStrength(){
    let hasupper=false;
    let haslower =false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasupper=true;
    if(lowercaseCheck.checked) haslower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasupper && haslower &&(hasNum || hasSym) && passwordLength>=8){
         setIndicator("#0f0");
    }
   else if(
    (haslower || hasupper) &&
   (hasNum || hasSym)&&
   passwordLength>=6)
   {
    setIndicator("#ff0");
   }
   else{
    setIndicator("#f00");
   }
}

async function copyContent(){
    try{
         await navigator.clipboard.writeText(passwordDisplay.value);//tb tk ruko jb tk copy na kr lo
         copymsg.innerText='copied';//jo span bnaya tha usme text chla jayega 
    }
    catch(e){
        copymsg.innerText="failed";
        
    }
    //to make copy wala text visible 
    copymsg.classList.add("active");
    //2 sec k liye dikhana 
    setTimeout(() => {
        copymsg.classList.remove("active");
    }, 2000);

}



inputSlider.addEventListener('input',(e)=>{
    passwordLength =e.target.value;
    handleSlider();
});

copybtn.addEventListener('click',()=>{
    if(passwordDisplay.value){//password wale box m agr ek non empty value h to   
        copyContent();
    }
})


function handleCheckBoxChange()
{
    checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkcount++;
    })
    
    //special corner case
    if(passwordLength < checkcount)
    {
        passwordLength=checkcount;
        handleSlider();
    }
} 



allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange)   //agr koi v checkbox ko ticked ya unticked kia jara h to phir se countcheck krke ayenge   
});


function shufflePassword(array){
    //fisher yates method
    for(let i=array.length-1; i>0 ; i--){
        //random j find krke swap krdia  
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=> (str+= el));
        return str;
}

generateBtn.addEventListener('click',()=>{
     if(checkcount<=0) return ;

     if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleSlider();
     }

     //journey to find the new password 


     //remove old password
     password="";

     //lets put the stuffed mentioned by checkboxes
    //  if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    //  }

    //  if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    //  }

    //  if(symbolsCheck.checked){
    //     password+=generateSymbol();
    //  }

    //  if(numberCheck.checked){
    //     password+=generateRandomNumber();
    //  }
     

    let funArr=[];
      if(uppercaseCheck.checked){
         funArr.push(generateUpperCase);
      }
      if(lowercaseCheck.checked){
         funArr.push(generateLowerCase);
      }
      if(numberCheck.checked){
         funArr.push(generateRandomNumber);
      }
      if(symbolsCheck.checked){
         funArr.push(generateSymbols);
      }

      //jo kaam krna hi krna tha vo krte h =>jo checked h phle vo bna lete h
    for(let i=0;i<funArr.length;i++){
        password+=funArr[i]();
    }
      //remaining addition
         for(let i=0;i<passwordLength-funArr.length;i++){
            let randomIdx=getRandomInteger(0,funArr.length);
            password+=funArr[randomIdx]();
         }


         //shuffle the password 
         password=shufflePassword(Array.from(password));//password ko array ki form m bhej dia
   
         //show in ui
         passwordDisplay.value=password;

         //calculate strength
         calStrength();
})