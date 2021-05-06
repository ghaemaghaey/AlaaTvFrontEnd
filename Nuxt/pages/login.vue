<template>
  <v-row>
    <v-col>
      <v-alert
        v-if="showSuccess"
        dismissible
        elevation="10"
        type="success"
        class="black--text"
        >Login completed go <nuxt-link to="/">Home</nuxt-link> page to Edit
        Data</v-alert
      >
      <v-alert v-if="showError" dismissible elevation="10" type="error"
        >User Name Or Password Is Incorrect</v-alert
      >
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="mobile"
          label="Mobile Number"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          required
          type="password"
        ></v-text-field>

        <v-btn color="success" class="mr-4" @click="postData">Sign In </v-btn>

        <v-btn color="warning" class="mr-4 black--text" @click="clear"><h3>Clear</h3></v-btn>
        <v-btn color="error" @click="logOut">LogOut</v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      request_data: null,
      mobile: "",
      password: "",
      showSuccess: false,
      showError: false,
    };
  },
  methods: {
    clear() {
      (this.mobile = ""), (this.password = "");
    },
    postData() {
      this.$axios
        .post("login", { mobile: this.mobile, password: this.password })
        .then((response) => {
          this.request_data = response.data.data;
        })
        .then((data) => {
          localStorage.setItem(
            "myData",
            JSON.stringify({
              citisData: null,
              access_token: this.request_data.access_token,
              user_id: this.request_data.user.id,
              adress: this.request_data.user.address,
              first_name: this.request_data.user.first_name,
              last_name: this.request_data.user.last_name,
              school: this.request_data.user.school,
              major_id: this.request_data.user.major,
              grade_id: this.request_data.user.grade,
              gender_id: this.request_data.user.gender,
              shahr_id: this.request_data.user.shahr,
            })
          );
          // localStorage.setItem("isAuth", true);
          this.$store.commit("changeToTrue");
          this.showSuccess = true;
        });
      // .catch((error) => {
      //   if (error.response.status == 422) {
      //     this.showError = true;
      //   }
      // });
    },
    logOut() {
      this.$store.commit("changeToFalse");
      localStorage.clear()
    },
  },
};
</script>