const app = new Vue({
  el: "#app",
  data() {
    return {
      wait: false,
      login: {
        username: "",
        password: "",
        error: [],
      },
      register: {
        username: "",
        password: "",
        confirmPassword: "",
        error: [],
      },
    };
  },
  methods: {
    checkLogin() {
      this.login.error = [];
      if (this.login.username.length < 3)
        this.login.error.push({
          msg: "Username needs to be at least 3 characters",
        });
      if (this.login.password.length < 8) {
        this.login.error.push({
          msg: "Password needs to be at least 8 characters",
        });
      }
      if (this.login.error.length === 0) {
        if ("alt" in window) {
          alt.emit(
            "web::lr::loginAccount",
            this.login.username,
            this.login.password
          );
        }
      }
    },
    checkRegistration() {
      this.register.error = [];
      if (this.register.username.length < 3)
        this.register.error.push({
          msg: "Username needs to be at least 3 characters",
        });
      if (this.register.password.length < 8) {
        this.register.error.push({
          msg: "Password needs to be at least 8 characters",
        });
      }
      if (this.register.confirmPassword.length < 8) {
        this.register.error.push({
          msg: "Confirm Password needs to be at least 8 characters",
        });
      }
      if (this.register.password !== this.register.confirmPassword) {
        this.register.error.push({
          msg: "Passwords don't match",
        });
      }

      if (this.register.error.length === 0) {
        if ("alt" in window) {
          this.wait = true;
          alt.emit(
            "web::lr::registerAccount",
            this.register.username,
            this.register.password
          );
        }
      }
    },
  },
  mounted() {
    if ("alt" in window) {
      alt.emit("web::lr:domContentLoaded");
    }
  },
});
