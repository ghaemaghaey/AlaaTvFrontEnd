<template>
  <div>
    <v-row>
      <v-btn color="primary"
        ><nuxt-link class="white--text" to="/login">Login</nuxt-link></v-btn
      >
    </v-row>
    <v-row>
      <v-col>
        <v-alert v-if="showSuccess" dismissible elevation="10" type="success" class="black--text"
          >Information changed successfully</v-alert
        ><v-alert v-if="showErrr" dismissible elevation="10" type="error"
          >Somthing went wrong please login again</v-alert>
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
    <v-select
      v-model="slc_gender"
      :items="genders"
      label="Genders"
      outlined
    ></v-select>
    <v-select
      v-model="slc_grade"
      :items="grades"
      label="Grade"
      outlined
    ></v-select>
    <v-select
      v-model="slc_major"
      :items="majors"
      label="Majors"
      outlined
    ></v-select>
    <v-select
      @change="changedPrivonce"
      v-model="slc_provinces"
      :items="provinces"
      label="Provinces"
      outlined
    ></v-select>
    <v-select
      v-model="slc_city"
      :items="cities"
      label="cities"
      outlined
    ></v-select>
    <v-btn @click="readyDataForSubmit" color="success"
      ><p class="black--text">Submit Data</p></v-btn
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      token_type: "Bearer",
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
      showSuccess:false,
    };
  },
  middleware({ redirect }) {
    if (!localStorage.getItem("isAuth")) {
      redirect("/login");
    }
  },
  mounted() {
    this.setAllData();
    this.setUpData();
    this.getCityData();
  },
  methods: {
    setAllData() {
      this.myData = JSON.parse(localStorage.getItem("myData"));
      // this.myData = JSON.parse(this.myData)
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
        this.setCityData();
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
    setCityData() {
      // console.log(this.userFormData);
      this.userFormData.genders.forEach((element) => {
        this.genders.push(element.title);
      });
      this.userFormData.majors.forEach((element) => {
        this.majors.push(element.title);
      });
      this.userFormData.provinces.forEach((element) => {
        this.provinces.push(element.title);
      });
      this.userFormData.cities.forEach((element) => {
        if (element.province.title == this.slc_provinces) {
          this.cities.push(element.title);
        }
        this.userFormData.grades.forEach((element) => {
          this.grades.push(element.title);
        });
      });
    },
    readyDataForSubmit() {
      this.userFormData.cities.forEach((e) => {
        if (e.title == this.slc_city) {
          this.shahr_id = e.id;
        }
      }),
        this.userFormData.majors.forEach((e) => {
          if (e.title == this.slc_major) {
            this.major_id = e.id;
          }
        }),
        this.userFormData.grades.forEach((e) => {
          if (e.title == this.slc_grade) {
            this.grade_id = e.id;
          }
        }),
        this.userFormData.genders.forEach((e) => {
          if (e.title == this.slc_gender) {
            this.gender = e.id;
          }
        });
      this.SubmitData();
    },
    SubmitData() {
      this.$axios.put(
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
      ).then(res=> {
        this.showSuccess = true
      }).catch(error=>{
        showError = true
      })
    },
  },
};
</script>
