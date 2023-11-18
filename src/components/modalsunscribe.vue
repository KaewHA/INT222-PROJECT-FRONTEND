<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { getuserAnnouncement, getCategory } from "../composable/data.js";
import { useMode } from "../stores/mode.js";
import router from "../router";
import { getToken, checkToken } from "../composable/Auth";
import { sendOTP, CHECKOTP, ADDNEWSUB } from "../composable/subscribe";

const totalpage = ref(0);
const pageSize = ref(0);
const currentpage = ref(0);
const allAnnouncement = ref([]);
const allCategory = ref([]);
const category = ref(0);
const newdata = ref([]);
const myMode = useMode();
const lastpage = ref(false);
const firstpage = ref(false);


const fetchData = async () => {
  newdata.value = [];
  const receivedData = await getuserAnnouncement(
    myMode.mode,
    currentpage.value,
    category.value
  );
  receivedData.content.forEach((x) => newdata.value.push(x));
  pageSize.value = receivedData.size;
  totalpage.value = receivedData.totalPages;
  lastpage.value = receivedData.last;
  firstpage.value = receivedData.first;
  allAnnouncement.value = newdata.value;
};

onBeforeMount(async () => {
  await fetchData();
  const receivedCategory = await getCategory();
  receivedCategory.forEach((category) => allCategory.value.push(category));
});


 


const isAuthenticated = localStorage.getItem('refreshtoken')
const isExpired = async () => {
  const token = localStorage.getItem('token')

  let result = await checkToken(token);
  if (result !== 200) {
    let newToken = await getToken()
    if (newToken === 401) {
      router.push('/login')
    } else {
      localStorage.setItem('token', newToken)
      router.push('/admin/announcement')
    }
  } else {
    router.push('/admin/announcement')
  }
}

const closemodal = (id) => {
  const content = document.querySelector(id)
  content.classList.add('hidemodal-content')
  inputEmail.value = ''
  inputOTP.value = ''
  setTimeout(() => {
    Subscribe.value = false
  }, "230");
}

const backtoemail = () => {
  let resent = document.querySelector('#resent')
  let resentmsg = document.querySelector('#resented')
  resent.classList.remove('hidden')
  resentmsg.classList.add('hidden')
  inputOTP.value = ''
  loading.value = false
  step1.value = true
  step2.value = false
  step3.value = false
}
//////////////////////SENT OTP///////////////////////////
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

const Subscribe = ref(false)
const Choosecategory = ref(false)
const loading = ref(false)
const inputEmail = ref('')
const emailValue = ref('')
const emailToken = ref(null)
const step1 = ref(true)
const step2 = ref(false)
const step3 = ref(false)
const step4 = ref(false)
const step4fail = ref(false)
const OTPref = ref('')

const getEmailToken = async () => {
  emailValue.value = inputEmail.value
  if (validateEmail(inputEmail.value)) {
    const emailObj = { email: inputEmail.value }
    let input = document.querySelector('.input')
    if (emailObj) {
      input.classList.add('hidemodal-contentslide')
      // setTimeout(() => {
      //   input.classList.add('hidden')
      //   loading.value = true
      // }, "950");
      input.classList.add('hidden')
      loading.value = true
      emailToken.value = await sendOTP(emailObj)
      input.classList.remove('hidden')
      input.classList.remove('hidemodal-contentslide')
      loading.value = false
    }
    let datatoken = decodeJwt(emailToken.value.token)
    step1.value = false
    step2.value = true
    OTPref.value = `REF : ${datatoken.REF}`
  } else {
    ////เมลผิด
  }
}
const decodeJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url?.replace(/-/g, "+")?.replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
const resentEmailToken = async () => {
  const emailObj = { email: emailValue.value }
  let resent = document.querySelector('#resent')
  let resentmsg = document.querySelector('#resented')
  if (emailObj) {
    resent.classList.add('hidden')
    resentmsg.classList.remove('hidden')
    setTimeout(() => {
      // input.classList.add('hidden')
      loading.value = true
      resentmsg.classList.add('hidden')
    }, "980");
    emailToken.value = await sendOTP(emailObj)
    // input.classList.remove('hidden')
    // input.classList.remove('hidemodal-contentslide')
    loading.value = false
    resentmsg.classList.remove('hidden')
    resentmsg.innerHTML = 'Your new OTP is sent.'
  }
  let datatoken = decodeJwt(emailToken.value.token)
  OTPref.value = `REF : ${datatoken.REF}`
  console.log(datatoken);
}
//////////////////////SENT OTP///////////////////////////
const inputOTP = ref("")
const status = ref(0)
const CheckOTPFUND = async () => {
  let errorOTPBox = document.querySelector('.otp-alert-box')
  let errorOTPMsg = document.querySelector('.otp-alert-message')
  if (inputOTP.value.length === 5) {
    const CHECK = { otp: inputOTP.value, token: emailToken.value.token }
    if (inputOTP.value) {
      status.value = await CHECKOTP(CHECK)
      if (status.value === 200) {
        step2.value = false
        step3.value = true
      } else if (status.value === 400) {
        errorOTPBox.classList.remove('hidden')
        errorOTPBox.classList.add('animate-jump')
        errorOTPBox.classList.add('animate-once')
        errorOTPBox.classList.add('animate-ease-in-out')
        errorOTPMsg.innerHTML = "Your OTP is not correct!"
      } else if (status.value === 401) {
        errorOTPBox.classList.remove('hidden')
        errorOTPBox.classList.add('animate-jump')
        errorOTPBox.classList.add('animate-once')
        errorOTPBox.classList.add('animate-ease-in-out')
        errorOTPMsg.innerHTML = "Verify Timeout!"
      }
    }
    console.log(status.value);
  } else {
    ////เมลผิด
  }
}

const closeAlert = (ele) => {
  let element = document.querySelector(ele)
  element.classList.add('hidden')
}

/////////////////////////////////////////

//////////////SUBCRIBE/////////////////
const subCategories = ref([])

const toggleJOBselect = (categoryId) => {
  const index = subCategories.value.findIndex(existingId => existingId === categoryId);
  const categoryItem = document.querySelector(`.category-item${categoryId}`)
  const selected = ['bg-emerald-400', 'border-0', 'text-white']
  const unselected = ['bg-white', 'text-gray-500']
  if (index !== -1) {
    subCategories.value.splice(index, 1);
    selected.forEach(className => categoryItem.classList.remove(className));
    unselected.forEach(className => categoryItem.classList.add(className));
    categoryItem.classList.add('hover:border-green-400')
    categoryItem.classList.add('hover:text-green-400')
  } else {
    subCategories.value.push(categoryId);
    unselected.forEach(className => categoryItem.classList.remove(className));
    selected.forEach(className => categoryItem.classList.add(className));
    categoryItem.classList.remove('hover:border-green-400')
    categoryItem.classList.remove('hover:text-green-400')
  }
  console.log(subCategories.value);
}

const ConfirmSub = async (categoryArr) => {
  if (categoryArr.length > 0) {
    // for (const category of categoryArr) {
    //   const subInfo = ref({ subcriberEmail: emailValue, categoriesid: category })
    //   await ADDNEWSUB(subInfo.value)
    //   console.log('category id' + category + 'has been subcribe!');
    // }
    const subInfo = ref({ subcriberEmail: emailValue.value, categoriesid: categoryArr })
    let subStatus = null
    loading.value = true
    subStatus = await ADDNEWSUB(subInfo.value)
    loading.value = false
    step3.value = false
    if(subStatus==200){
        step4.value=true
    }else{
        step4fail.value = true
    }
   
  } else {
    let subConAlert = document.querySelector('.sub-con-alert')
    subConAlert.classList.remove('hidden')
    subConAlert.classList.add('animate-jump')
    subConAlert.classList.add('animate-once')
    subConAlert.classList.add('animate-ease-in-out')
    setTimeout(() => {
      subConAlert.classList.add('hidden')
    }, 3500)
  }

  // let SUBINFO = { subcriberEmail: emailValue.value, categoryid: general.value }
  // if (general.value == 1 || scholarship.value == 1 || intern.value == 1 || job == 1) {
  //   let subcribestatus = ref()
  //   subcribestatus.value = await ADDNEWSUB(SUBINFO)
  //   step3.value = false
  //   step4.value = true
  // } else {
  //   let subConAlert = document.querySelector('.sub-con-alert')
  //   subConAlert.classList.remove('hidden')
  //   subConAlert.classList.add('animate-jump')
  //   subConAlert.classList.add('animate-once')
  //   subConAlert.classList.add('animate-ease-in-out')
  //   setTimeout(() => {
  //     subConAlert.classList.add('hidden')
  //   }, 3500)
  // }
}

const loginWithDefault = () => {
  step1.value = false
  step3.value = true
  emailValue.value = decodeJwt(localStorage.getItem('token')).email
} 

const resetSubProcess = () => {
  closemodal('#Subcribe')
  setTimeout(() => {
    inputEmail.value = ''
    emailToken.value = ''
    emailValue.value = ''
    subCategories.value = []
    status.value = 0
    step4.value = false
    step4fail.value=false
    step1.value = true
  }, 200)
  
}

</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-25 z-30 flex justify-center items-center">
    <div class="modal-overlay bg-transparent w-full h-full z-40 modalscope" @click="closemodal('#Subcribe'),$emit('closeme')"></div>
    <div
      class="w-[30%] flex flex-col justify-center items-center bg-white rounded-xl z-50 absolute py-8 px-4 modal-content h-[38%]"
      id="Subcribe">
      <div class="w-full flex flex-col justify-center items-center font-noto" v-show="step1">
        <div>
          <img src="/images/mailbox.png" alt="" width="128">
        </div>
        <h1 class="text-center text-xl font-semibold text-custom-blue mt-3">SUBSCRIBE</h1>
        <h2 class="text-gray-500 text-sm text-center mt-3">Subscribe to new announcement.</h2>
        <div class="w-full flex flex-row justify-center mt-7 input" :class="loading ? 'hidden' : ''">
          <input v-model="inputEmail"
            class="w-3/6 rounded-l-full text-sm bg-gray-200 border-0 placeholder:text-xs placeholder:text-slate-400 focus:ring-0"
            type="email" placeholder="ENTER YOUR EMAIL" required>
          <button @click="getEmailToken"
            class="rounded-r-full bg-custom-blue text-white text-xs px-4 py-2">SUBSCRIBE</button>
        </div>
        <h2 v-if="isAuthenticated" class="mt-4 text-sm text-gray-500"><span class="">Or</span> subscribe with your 
          <span @click="loginWithDefault"
            class="text-custom-blue/90 underline font-semibold cursor-pointer hover:text-custom-blue">Email</span>.</h2>
        <div class="lds-dual-ring w-7 h-7" id="loading" v-if="loading"></div>
      </div>
      <div class="w-full flex flex-col justify-center items-center font-noto relative " v-show="step2">
        <div>
          <img src="/images/email.png" alt="" width="128">
        </div>
        <div
          class="absolute top-0 left-6 rounded-full cursor-pointer w-[5%] border bg-slate-200 hover:bg-custom-blue hover:-translate-x-3 transition duration-400 flex justify-center hover:text-white px-4"
          @click="backtoemail"><span class=" material-symbols-outlined  justify-center text-xl">arrow_back</span></div>
        <h1 class="text-center text-xl font-semibold text-custom-blue mt-3">Verify email</h1>
        <h2 class="text-gray-500 text-sm text-center mt-3">We have sent OTP on your email.</h2>
        <div class="w-full flex flex-row justify-center mt-10 relative">
          <input v-model="inputOTP" @keydown="closeAlert('.otp-alert-box')"
            class="w-3/6 rounded-l-full text-sm bg-gray-200 border-0 placeholder:text-xs placeholder:text-slate-400 focus:ring-0"
            type="text" id="OTPINPUT" :placeholder="OTPref" required>
          <button @click="CheckOTPFUND" class="rounded-r-full bg-custom-blue text-white text-xs px-4 py-2">ENTER</button>
          <div class="bg-red-500 text-white text-xs rounded-md py-1 px-2 -top-7 absolute hidden otp-alert-box">
            <p class="otp-alert-message"></p>
            <div class="absolute bg-red-500 bottom-0 left-1/3 rotate-45 w-4 h-4 -z-10"></div>
          </div>
        </div>
        <div class="mt-3 text-gray-500 text-sm mr-3" id="resent">Didn't you receive a OTP? <span
            class="font-bold underline cursor-pointer" @click="resentEmailToken"> Resent OTP</span></div>
        <div class="mt-3 text-gray-500 text-sm mr-3 hidden" id="resented">We already have sent you email again.</div>
        <div class="lds-dual-ring w-7 h-7" id="loading" v-if="loading"></div>
      </div>
      <div class="w-full flex flex-col justify-center items-center font-noto relative h-full" v-show="step3">
        <div
          class="absolute top-0 left-6 rounded-full cursor-pointer w-[5%] border bg-slate-200 hover:bg-custom-blue hover:-translate-x-3 transition duration-400 flex justify-center hover:text-white px-4"
          @click="backtoemail"><span class="material-symbols-outlined justify-center text-xl">arrow_back</span></div>
        <div class="w-full flex justify-center items-center space-x-3 text-custom-blue pt-3">
          <span class="material-symbols-outlined text-4xl">tune</span>
          <p class="text-3xl font-bold font-noto">Subcribe Options</p>
        </div>
        <p class="text-gray-500 text-xs">Select categories and Confirm for subcribe</p>
        <p class="text-gray-500 text-xs">YOUR EMAIL : {{ emailValue }}</p>
        <div class=" w-full h-full flex flex-row flex-wrap items-center justify-center gap-x-5 pt-10">
          <div class="lds-dual-ring w-7 h-7" id="loading" v-if="loading"></div>
          <div v-else v-for="category in allCategory"
            class="w-[40%] h-[30%] rounded-xl transition duration-300 flex justify-center items-center flex-col text-gray-500 border cursor-pointer hover:border-green-400 hover:text-green-400"
            :class="`${'category-item' + category.categoryID}`" @click="toggleJOBselect(category.categoryID)">
            <div class="w-full h-full flex items-center flex-row space-x-2 px-3">
              <span class="material-symbols-outlined">{{ category.categoryName === 'ทั่วไป' ? 'info' :
                category.categoryName === 'ทุนการศึกษา' ? 'attach_money' : category.categoryName === 'ฝึกงาน' ?
                  'work_history' : 'work' }}</span>
              <p>{{ category.categoryName }}</p>
            </div>
          </div>
        </div>
        <button
          class="py-2 px-4 rounded-full bg-custom-blue/90 text-white hover:bg-custom-blue/100 active:scale-90 transition duration-200 shadow-2xl"
          @click="ConfirmSub(subCategories)">Confirm</button>
        <div class="bg-red-500 text-white text-xs rounded-md py-1 px-2 top-[6.3rem] absolute hidden  sub-con-alert">
          <p class="">Select at least 1 category.</p>
        </div>
        
      </div>
      <div @click="resetSubProcess(),$emit('closeme')" class="w-full flex flex-col justify-center items-center font-noto space-y-12"
        v-show="step4">
        <img src="/images/mailSuccess.png" alt="" width="128">
        <div class="flex flex-col items-center space-y-4">
          <p class="text-2xl font-semi-bold text-gray-600">Thank you for your subscribe.</p>
          <button
            class="w-1/3 py-2 px-4 rounded-full bg-custom-blue/90 text-white hover:bg-custom-blue/100 active:scale-90 transition duration-200 shadow-2xl">Close</button>
        </div>
      </div>
      <div @click="resetSubProcess(),$emit('closeme')" class="w-full flex flex-col justify-center items-center font-noto space-y-12"
        v-show="step4fail">
        <img src="/images/emailfail.png" alt="" width="128">
        <div class="flex flex-col items-center space-y-4">
          <p class="text-2xl font-semi-bold text-red-500">Cant subscribe</p>
          <p class="text-xs font-semi-bold text-gray-600">Something went wrong! Prese try again.</p>
          <button
            class="w-1/3 py-2 px-4 rounded-full bg-custom-blue/90 text-white hover:bg-custom-blue/100 
            active:scale-90 transition duration-200 shadow-2xl flex justify-center">Close</button>
        </div>
      </div>
    </div>
  </div>
 
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}

.modalscope {
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  animation: pulse 0.3s ease-out;
}

.hidemodal-content {
  animation: pulsereverse 0.3s ease-out;
}

.hidemodal-contentslide {
  animation: pulsereverseslide 1s ease-out;
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    opacity: 0;
    transform: scale(.3);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }

  70% {
    transform: scale(.9);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes pulsereverse {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(.95);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }

  100% {
    opacity: 0;
    transform: scale(.3);
  }
}


@keyframes pulsereverseslide {
  0% {
    width: 100%;
  }

  50% {
    width: 0%;
  }

  65% {
    width: 0%;
    opacity: 1;
    transform: scale(1.1);
  }

  100% {
    width: 0%;
    opacity: 0;
    transform: scale(0);
  }
}

.lds-dual-ring {
  display: inline-block;
}

.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 24px;
  height: 24px;
  margin: 8px;
  border-radius: 50%;
  border: 2px solid #4D9DE0;
  border-color: #4D9DE0 transparent #4D9DE0 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* .category-item input[type="checkbox"] {
  display: none;
} */
</style>