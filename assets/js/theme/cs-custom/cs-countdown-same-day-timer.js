/*eslint-disable*/
import moment from 'moment-timezone';

const VERSION = '1.0.2';
let preMSg = 'Order in the next';
let sameDay = "for same day shipping";
let exDayShipping = 'for shipping on';
let mondayShipping = 'for shipping on Monday';
let sameDayHourend = 17;
let exHourEnd = 24;


export default class CountdownSameDayTimer {
  constructor($scope, $contextData) {
    this.$scope = $scope;

    const timer_preMSg = $contextData.preMSg;
    const timer_sameDay = $contextData.sameDay;
    const timer_exDayShipping = $contextData.exDayShipping;
    const timer_mondayShipping = $contextData.mondayShipping;
    const timer_sameDayHourend = $contextData.sameDayHourend;
    const timer_exHourEnd = $contextData.exHourEnd;
    if (timer_preMSg) {
      preMSg = timer_preMSg;
    }
    if (timer_sameDay) {
      sameDay = timer_sameDay;
    }
    if (timer_exDayShipping) {
      exDayShipping = timer_exDayShipping;
    }
    if (timer_mondayShipping) {
      mondayShipping = timer_mondayShipping;
    }
    if (timer_sameDayHourend) {
      sameDayHourend = parseInt(timer_sameDayHourend);
    }
    if (timer_exHourEnd) {
      exHourEnd = parseInt(timer_exHourEnd);
    }

    this.daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    this.nxtday = '';

    // configuration
    this.config = {
      timezone: 'Europe/London', // Asia/Kolkata  // other zones --> https://github.com/moment/moment-timezone/blob/develop/data/packed/latest.json
      range: {
        day: [1, 5], // 0 = sunday, 6 = saturday
        hour: [0, sameDayHourend], // 0 = midnight, 15 = 3PM
        exhour: [sameDayHourend, exHourEnd], //15 = 3PM, 0 = midnight
      }
    };
    // grab our elements
    this.clockEl = $('#its-timer', this.$scope);
    this.timeEl = $('#its-timer__time', this.clockEl);
    // setup base moment stuff
    // this.deadline = moment.tz(this.config.range.hour[1], 'H', this.config.timezone);

    // start the clock
    if (!this.isBoardProduct()) {
      this.startClock();
    }
  }

  /**
   * if product URL ends in "board.html" or the product title has "Boards" in it
   */
  isBoardProduct() {
    return (
      window.location.href.indexOf('boards.html') !== -1 ||
      $('.productView-title', this.$scope).text().indexOf('Boards') !== -1
    );
  }

  /**
   * determine if today is within the day range
   */
  isWithinDayRange(today) {
    const [startingDay, endingDay] = this.config.range.day; // 1, 5 (Mon, Fri)
    return (today >= startingDay && today <= endingDay);
  }

  /**
   * determine if now is within the hour range
   */
  isWithinHourRange(thisHour) {
    const [startingHour, endingHour] = this.config.range.hour;
    return (thisHour >= startingHour && thisHour < endingHour);
  }

  isWithinExHourRange(thisHour) {
    const [startingHour, endingHour] = this.config.range.exhour;
    return (thisHour >= startingHour && thisHour < endingHour);
  }


  startClock() {

    // let currantTime = moment('2020-03-16T15:01:00+05:30').tz(this.config.timezone);
    let currantTime = moment().tz(this.config.timezone);
    let currantDate = moment(currantTime).tz(this.config.timezone).format('YYYY-MM-DD');

      let updateTime = () => {
      let today = parseInt(currantTime.format('d'));
      let thisHour = parseInt(currantTime.format('H'));
      let isWithinDayRange = this.isWithinDayRange(today);
      let isWithinHourRange = this.isWithinHourRange(thisHour);
      let isWithinExHourRange = this.isWithinExHourRange(thisHour);
      let postMsg;
      if (isWithinDayRange && isWithinHourRange) { // Mon - Fri and 1 to 15
        //postMsg = sameDay;
        postMsg = exDayShipping + ' <strong>' + this.daysInWeek[today] +'</strong>';
        this.deadline =  moment.tz(currantDate,  this.config.timezone).add(this.config.range.hour[1], 'h');
      } else if (isWithinDayRange && isWithinExHourRange) { // Mon - Fri and 15 to 24
        if (today === 5) {
          this.deadline = moment.tz(currantDate,  this.config.timezone).add(this.config.range.exhour[1], 'h').add(2, 'd').add((this.config.range.hour[1] - this.config.range.hour[0]), 'h');
          postMsg = mondayShipping;
        } else {
          this.deadline = moment.tz(currantDate,  this.config.timezone).add(this.config.range.exhour[1], 'h').add((this.config.range.hour[1] - this.config.range.hour[0]), 'h');

          postMsg = exDayShipping + ' <strong>' + this.daysInWeek[today + 1] +'</strong>';
        }
      } else { // Sat, sun
        if (today === 6) {
          this.deadline = moment.tz(currantDate,  this.config.timezone).add(this.config.range.exhour[1], 'h').add(1, 'd').add((this.config.range.hour[1] - this.config.range.hour[0]), 'h');
          postMsg = mondayShipping;
        } else {
          this.deadline = moment.tz(currantDate,  this.config.timezone).add(this.config.range.exhour[1], 'h').add((this.config.range.hour[1] - this.config.range.hour[0]), 'h');
          postMsg = mondayShipping;
        }
      }

      if ((hour < 0) || (minute < 0) || (second < 0)) {
        $('body').addClass('hide-timer');
      }

      $('.pre-msg').text(preMSg);
      $('.post-msg').html(postMsg);
      let secondsDiff = this.deadline.diff(currantTime, 'seconds');
      let hour = Math.floor(secondsDiff / 3600);
      let minute = Math.floor(secondsDiff / 60) % 60;
      let second = secondsDiff % 60;
      let displayTime = [hour, minute, second].map((num) => ('0' + num).slice(-2)).join(':');
      $('.t-minutes').text(minute);
      $('.t-hours').text(hour);
      
      //this.timeEl.html(displayTime);
      currantTime.add(1, 'second');
    };


    // Update the count down every 1 second
    const timeInterval = setInterval(updateTime, 1000);
    updateTime();
    this.clockEl.show();
  }
}
/*eslint-unable*/
