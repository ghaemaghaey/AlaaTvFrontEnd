<template>
  <div>
    <v-row>
      <v-btn color="primary"
        ><nuxt-link class="white--text" to="/login">Login</nuxt-link></v-btn
      >
    </v-row>
    <v-row>
      <v-col>
        <v-alert
          v-if="showSuccess"
          dismissible
          elevation="10"
          type="success"
          class="black--text"
          >Information changed successfully</v-alert
        ><v-alert v-if="showError" dismissible elevation="10" type="error"
          >Somthing went wrong please login again</v-alert
        >
      </v-col>
    </v-row>
    <v-row>
      <v-text-field label="first_name" readonly="readonly" v-model="first_name">
      </v-text-field>
    </v-row>
    <v-row>
      <v-text-field label="last_name" readonly="readonly" v-model="last_name">
      </v-text-field>
    </v-row>
    <v-row>
      <v-text-field label="adress" v-model="adress"> </v-text-field>
    </v-row>
    <v-row>
      <v-text-field label="school" v-model="school"> </v-text-field>
    </v-row>
    <v-form
    ref="form"
    lazy-validation>
      <v-select
        required
        :rules="[(v) => !!v || 'Gender is required']"
        v-model="slc_gender"
        :items="genders"
        label="Genders"
        outlined
      ></v-select>
      <v-select
        required
        :rules="[(v) => !!v || 'Grade is required']"
        v-model="slc_grade"
        :items="grades"
        label="Grade"
        outlined
      ></v-select>
      <v-select
        v-model="slc_major"
        :rules="[(v) => !!v || 'Major is required']"
        :items="majors"
        required
        label="Majors"
        outlined
      ></v-select>
      <v-select
        required
        :rules="[(v) => !!v || 'Provinces is required']"
        @change="changedPrivonce"
        v-model="slc_provinces"
        :items="provinces"
        label="Provinces"
        outlined
      ></v-select>
      <v-select
        required
        :rules="[(v) => !!v || 'City is required']"
        v-model="slc_city"
        :items="cities"
        label="cities"
        outlined
      ></v-select>
      <v-btn
        @click="beforeReadyDataForSubmit(user_id, first_name)"
        color="success"
        class="black--text"
        >Submit Data</v-btn
      >
    <v-btn color="error" @click="logOut">SignOut</v-btn>
      </v-form
    >
  </div>
</template>

<script>
export default {
  middleware: ["new"],
  data() {
    return {
      token_type: "Bearer",
      province: null,
      user_id: null,
      first_name: null,
      last_name: null,
      adress: null,
      school: null,
      major_id: null,
      grade_id: null,
      gender_id: null,
      shahr_id: null,
      myData: null,
      userFormData: null,
      genders: [],
      majors: [],
      grades: [],
      cities: [],
      provinces: [],
      slc_provinces: "آذربایجان شرقی",
      slc_gender: null,
      slc_grade: null,
      slc_major: null,
      slc_city: null,
      showSuccess: false,
      showError: false,
      idList: ["province", "gender_id", "grade_id", "major_id", "shahr_id"],
      slcList: [
        "slc_provinces",
        "slc_gender",
        "slc_grade",
        "slc_major",
        "slc_city",
      ],
      normalList: ["provinces", "genders", "grades", "majors", "cities"],
    };
  },

  mounted() {
    this.setAllData();
    this.setUpData();
    this.getCityData();
    addEventListener('beforeunload',this.beforeUnloadFunc)
  },
  methods: {
    setAllData() {
      this.myData = JSON.parse(localStorage.getItem("myData"));
    },
    setUpData() {
      this.user_id = this.myData.user_id;
      this.first_name = this.myData.first_name;
      this.last_name = this.myData.last_name;
      this.adress = this.myData.adress;
      this.school = this.myData.school;
      this.major = this.myData.major;
      this.grade = this.myData.grade;
      this.gender = this.myData.gender;
      this.shahr = this.myData.shahr;
    },
    getCityData() {
      this.$axios.get("megaroute/getUserFormData").then((res) => {
        this.userFormData = res.data.data;
        for (let counter = 0; counter < this.normalList.length; counter++) {
          this.setCityData(this.normalList[counter]);
        }
      });
    },
    changedPrivonce() {
      // console.log('privence changed');
      (this.cities = []),
        this.userFormData.cities.forEach((element) => {
          if (element.province.title == this.slc_provinces) {
            this.cities.push(element.title);
          }
        });
    },
    setCityData(normalListVariable) {
      if(normalListVariable == 'cities'){
        this.userFormData['cities'].forEach((element)=>{
          if(element.province.title == this.slc_provinces){
            this.cities.push(element.title)
          }
        }
        )
      }else{
        this.userFormData[normalListVariable].forEach((element) => {
          this[normalListVariable].push(element.title);
        });
      }
    },
    beforeReadyDataForSubmit() {
      if(this.$refs.form.validate()){
        for (let i = 0; i < this.slcList.length; i++) {
          this.readyDataForSubmit(
            this.slcList[i],
            this.normalList[i],
            this.idList[i]
          );
        }
        this.SubmitData()
      }
    },
    readyDataForSubmit(slcVariable, outputList, idList) {
      this.userFormData[outputList].forEach((e) => {
        if (e.title == this[slcVariable]) {
          this[idList] = e.id;
        }
      });
      // console.log(this.province);
    },

    // this.SubmitData();
    SubmitData() {
      this.$axios
        .put(
          `user/${this.user_id}`,
          {
            first_name: this.first_name,
            last_name: this.last_name,
            address: this.address,
            school: this.school,
            major_id: this.major_id,
            grade_id: this.grade_id,
            gender_id: this.gender_id,
            shahr_id: this.shahr_id,
          },
          {
            headers: {
              Authorization: this.token_type + " " + this.myData.access_token,
            },
          }
        )
        .then((res) => {
          this.showSuccess = true;
        })
        .catch((error) => {
          showError = true;
        });
    },
    logOut() {
      this.$store.commit("changeToFalse");
      localStorage.clear();
      this.$router.push('/login')
    },
    beforeUnloadFunc() {
      this.$store.commit("changeToFalse");
      localStorage.clear();
    }
  },
};
</script>