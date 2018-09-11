const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
  
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  
  const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
  }
  
  const timeDiff = (start_time, end_time) => {
	//计算天数
	let timediff = Math.abs(Math.abs(end_time) - Math.abs(start_time));
  
	return {
	  "day": parseInt(timediff / 86400),
	  "hour": parseInt(timediff % 86400 / 3600),
	  "min": parseInt(timediff % 86400 % 3600 / 60),
	  "sec": parseInt(timediff % 86400 % 3600 % 60)
	};
  }
  
  module.exports = {
	formatTime: formatTime,
	timeDiff: timeDiff
  }
  