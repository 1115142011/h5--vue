export default {
  methods: {
    temporaryRepair (e) {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        let tar = document.querySelectorAll('.footer-btn');
        tar.forEach(tag => {
          tag.style.visibility = 'visible';
        });
        // this.$store.commit('transform_resize', false);
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollTop + 1);
          document.getElementsByTagName('body')[0].style.height =
            window.innerHeight + 'px';
          document.body.scrollTop >= 1 &&
            window.scrollTo(0, document.body.scrollTop - 1);
        }, 50);
      }
    },
    fouce () {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        // this.$store.commit('transform_resize', true);
        let tar = document.querySelectorAll('.footer-btn');
        tar.forEach(tag => {
          tag.style.visibility = 'hidden';
        });
      }
    }
  }
};
