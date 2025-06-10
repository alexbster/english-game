var stage;
var clock1;

function init() {
  document.getElementById('game_container').style.display = "inline";
  document.getElementById('loading_div').style.display = "none";

  stage = new createjs.Stage("canvasStage");
  createjs.Touch.enable(stage, true, false);

  clock1 = new clock(390, 375, 6, 0, 1);

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", handleTick);
}

function handleTick(event) {
  stage.update(event);
}

function clock(x, y, hour, minute, scale) {
  var color_on = true;
  var hour_type = 12;
  var clock_container;
  var hour_hand_container;
  var hour_hand;
  var hour_hand_drag = false;
  var hour_hand_offset_x;
  var hour_hand_offset_y;
  var minute_hand_container;
  var minute_hand;
  var minute_hand_drag = false;
  var minute_hand_offset_x;
  var minute_hand_offset_y;
  var center_x = x;
  var center_y = y;
  var quadrant_hour;
  var quadrant_minute;
  var hour = hour;
  var minute = minute;
  var digital;
  var am_pm;
  var am_pm_value = "AM";
  var previous_hour = hour;
  var color_list = ["#000000", "#000000", "#1976D2", "#FF5722", "#388E3C"];
  var minute_color = color_list[1];
  var clock_color = "#000000";

  clock_container = new createjs.Container();
  clock_container.x = 0;
  clock_container.y = 0;
  stage.addChild(clock_container);

  var circle_back = new createjs.Shape();
  var circle_back_fill = circle_back.graphics.beginFill(minute_color).command;
  circle_back.graphics.drawCircle(0, 0, 374);
  circle_back.x = center_x;
  circle_back.y = center_y;
  clock_container.addChild(circle_back);

  var circle_face = new createjs.Shape();
  circle_face.graphics.beginFill("white").drawCircle(0, 0, 330);
  circle_face.x = center_x;
  circle_face.y = center_y;
  clock_container.addChild(circle_face);

  var hour_lines_detail = new Array;
  var hour_lines_fill = new Array;
  var radius = 316;
  for (var i = 1; i <= 12; i++) {
    var radians = (-60 + ((i - 1) * 30)) / 180 * Math.PI;
    hour_lines_detail[i] = new createjs.Shape();
    hour_lines_fill[i] = hour_lines_detail[i].graphics.beginFill(minute_color).command;
    hour_lines_detail[i].graphics.drawRect(-10, -3, 26, 6);
    hour_lines_detail[i].x = center_x + radius * Math.cos(radians);
    hour_lines_detail[i].y = center_y + radius * Math.sin(radians);
    hour_lines_detail[i].rotation = (-60 + ((i - 1) * 30));
    clock_container.addChild(hour_lines_detail[i]);
  }

  var minute_lines = new Array;
  var minute_lines_fill = new Array;
  var radius = 322;
  for (var i = 1; i <= 60; i++) {
    var radians = (-60 + ((i - 1) * 6)) / 180 * Math.PI;
    minute_lines[i] = new createjs.Shape();
    minute_lines_fill[i] = minute_lines[i].graphics.beginFill(minute_color).command;
    minute_lines[i].graphics.drawRect(-10, -1, 20, 2);
    minute_lines[i].x = center_x + radius * Math.cos(radians);
    minute_lines[i].y = center_y + radius * Math.sin(radians);
    minute_lines[i].rotation = (-60 + ((i - 1) * 6));
    clock_container.addChild(minute_lines[i]);
  }

  var minute_numbers = new Array;
  var radius = 350;
  var display_number
  for (var i = 1; i <= 12; i++) {
    var radians = (-60 + ((i - 1) * 30)) / 180 * Math.PI;
    display_number = i * 5;
    if (display_number == 60) {
      display_number = "00";
    }
    minute_numbers[i] = new createjs.Text(display_number, "22px Roboto", "#FFF");
    minute_numbers[i].x = center_x + radius * Math.cos(radians);
    minute_numbers[i].y = center_y + radius * Math.sin(radians);
    //minute_numbers[i].rotation = (-60 + ((i - 1) * 30))+90;
    minute_numbers[i].textBaseline = "middle";
    minute_numbers[i].textAlign = "center";
    clock_container.addChild(minute_numbers[i]);
  }

  var hour_numbers = new Array;
  var hour_numbers_outline = new Array;
  var radius = 260;
  for (var i = 1; i <= 12; i++) {
    var radians = (-60 + ((i - 1) * 30)) / 180 * Math.PI;
    hour_numbers[i] = new createjs.Text(i, "76px Roboto", "#34495E");
    hour_numbers[i].color = clock_color;
    hour_numbers[i].x = center_x + radius * Math.cos(radians);
    hour_numbers[i].y = 7 + center_y + radius * Math.sin(radians);
    hour_numbers[i].textBaseline = "middle";
    hour_numbers[i].textAlign = "center";
    hour_numbers_outline[i] = hour_numbers[i].clone();
    hour_numbers_outline[i].outline = 2;
    hour_numbers_outline[i].color = "#000000";
    clock_container.addChild(hour_numbers[i]);
  }


  am_pm = new createjs.Text(i, "20px Roboto", "#2C3E50");
  am_pm.x = center_x;
  am_pm.y = 340;
  am_pm.textBaseline = "middle";
  am_pm.textAlign = "center";
  am_pm.text = "AM";
  //ABURGOS
  //clock_container.addChild(am_pm);

  minute_hand_container = new createjs.Container();
  clock_container.addChild(minute_hand_container);
  var minute_hand_line = new createjs.Shape();
  minute_hand_line.graphics.beginStroke("#000000").setStrokeStyle(2).setStrokeDash([10, 5]).moveTo(0, 0).lineTo(0, 330).endStroke();
  minute_hand_line.alpha = .3;
  minute_hand_line.rotation = 270;
  minute_hand = new createjs.Shape();
  var minute_hand_fill = minute_hand.graphics.beginFill(minute_color).command;
  minute_hand.graphics.drawRect(-20, -10, 330, 20);
  var minute_hand_end = new createjs.Shape();
  minute_hand_end.graphics.beginFill("#000000").moveTo(0, 60).lineTo(60, 60).lineTo(30, 120).lineTo(0, 60).endStroke();
  minute_hand_end.rotation = 270;
  minute_hand_end.x = 110;
  minute_hand_end.y = 30;
  var minute_hand_grab = new createjs.Shape();
  minute_hand_grab.hitArea = new createjs.Shape();
  minute_hand_grab.hitArea.graphics.beginFill("#FFF000").drawCircle(30, 140, 60);
  minute_hand_grab.rotation = 270;
  minute_hand_grab.x = 130;
  minute_hand_grab.y = 30;
  var minute_hand_circle = new createjs.Shape();
  minute_hand_circle.graphics.beginStroke("#000000").setStrokeStyle(2).setStrokeDash([10, 5]).drawCircle(30, 140, 60);
  minute_hand_circle.alpha = .3;
  minute_hand_circle.rotation = 270;
  minute_hand_circle.x = 130;
  minute_hand_circle.y = 30;
  minute_hand_container.addChild(minute_hand_line, minute_hand, minute_hand_grab, minute_hand_circle);
  minute_hand_container.x = center_x;
  minute_hand_container.y = center_y;
  minute_hand_container.on("pressup", function (event) {
    minute_hand_drag = false;
  })
  minute_hand_container.on("pressmove", function (event) {
    if (!minute_hand_drag) {
      var distance = getDistance(event.stageX, center_x, event.stageY, center_y);
      var point_x = center_x + distance * Math.cos((minute_hand_container.rotation / 180) * Math.PI);
      var point_y = center_y + distance * Math.sin((minute_hand_container.rotation / 180) * Math.PI);
      minute_hand_offset_x = (point_x - event.stageX);
      minute_hand_offset_y = (point_y - event.stageY);
      quadrant_hour = 0;
      quadrant_minute = 0;
      minute_hand_drag = true;
    }
    var angle = getDirection(event.stageX + minute_hand_offset_x, center_x, event.stageY + minute_hand_offset_y, center_y);
    minute = minute_move(angle);
    if (minute <= 15) {
      if (quadrant_minute == 2) {
        hour_increase();
        check_am_pm(false);
      }
      quadrant_minute = 1;
    } else if (minute >= 45) {
      if (quadrant_minute == 1) {
        hour_decrease();
        check_am_pm(false);
      }
      quadrant_minute = 2;
    } else {
      quadrant_minute = 0;
    }
    clock_angles(hour, minute);
  });

  hour_hand_container = new createjs.Container();
  clock_container.addChild(hour_hand_container);
  var hour_hand_line = new createjs.Shape();
  hour_hand_line.graphics.beginStroke("#000000").setStrokeStyle(1).setStrokeDash([10, 5]).moveTo(0, 0).lineTo(0, 340).endStroke();
  hour_hand_line.alpha = .3;
  hour_hand_line.rotation = 270;
  hour_hand = new createjs.Shape();
  hour_hand.graphics.beginFill("#000000").drawRect(-20, -10, 200, 20);
  var hour_hand_end = new createjs.Shape();
  hour_hand_end.graphics.beginFill("#95A5A6");
  hour_hand_end.graphics.moveTo(0, 60).lineTo(60, 60).lineTo(30, 120).lineTo(0, 60);
  hour_hand_end.rotation = 270;
  hour_hand_end.x = 60;
  hour_hand_end.y = 30;
  var hour_hand_grab = new createjs.Shape();
  hour_hand_grab.hitArea = new createjs.Shape();
  hour_hand_grab.hitArea.graphics.beginFill("#FFF000").drawCircle(30, 130, 60);
  hour_hand_grab.rotation = 270;
  hour_hand_grab.x = 130;
  hour_hand_grab.y = 30;
  var hour_hand_circle = new createjs.Shape();
  hour_hand_circle.graphics.beginStroke("#000000").setStrokeStyle(2).setStrokeDash([10, 5]).drawCircle(30, 130, 60);
  hour_hand_circle.alpha = .3;
  hour_hand_circle.rotation = 270;
  hour_hand_circle.x = 130;
  hour_hand_circle.y = 30;
  hour_hand_container.addChild(hour_hand_line, hour_hand, hour_hand_grab, hour_hand_circle);
  hour_hand_container.x = center_x;
  hour_hand_container.y = center_y;
  hour_hand_container.on("pressup", function (event) {
    hour_hand_drag = false;
  })
  hour_hand_container.on("pressmove", function (event) {
    if (!hour_hand_drag) {
      var distance = getDistance(event.stageX, center_x, event.stageY, center_y);
      var point_x = center_x + distance * Math.cos((hour_hand_container.rotation / 180) * Math.PI);
      var point_y = center_y + distance * Math.sin((hour_hand_container.rotation / 180) * Math.PI);
      hour_hand_offset_x = (point_x - event.stageX);
      hour_hand_offset_y = (point_y - event.stageY);
      quadrant_hour = 0;
      quadrant_minute = 0;
      hour_hand_drag = true;
    }
    var angle = getDirection(event.stageX + hour_hand_offset_x, center_x, event.stageY + hour_hand_offset_y, center_y);
    if (angle < 0 && angle >= -90) {
      if (quadrant_hour == 2) {
        check_am_pm(true);
      }
      quadrant_hour = 1;
    } else if (angle < -90 && angle >= -180) {
      if (quadrant_hour == 1) {
        check_am_pm(true);
      }
      quadrant_hour = 2;
    } else {
      quadrant_hour = 0;
    }

    find_hour_minute(angle);
    clock_angles(hour, minute);
  });

  var circle_center = new createjs.Shape();
  circle_center.graphics.beginFill("#34495E").beginStroke("#2C3E50").setStrokeStyle(10).drawCircle(0, 0, 20);
  circle_center.x = center_x;
  circle_center.y = center_y;
  //clock_container.addChild(circle_center);

  var circle_center_outline = new createjs.Shape();
  circle_center_outline.graphics.beginStroke("#000000").setStrokeStyle(1).drawCircle(0, 0, 30);
  circle_center_outline.x = center_x;
  circle_center_outline.y = center_y;
  //clock_container.addChild(circle_center_outline);

  clock_container.regX = center_x / 2;
  clock_container.regY = center_y / 2;
  clock_container.x = center_x - center_x / 2;
  clock_container.y = center_y - center_y / 2;
  clock_container.scale = scale;

  var digital_container = new createjs.Container();
  digital_container.x = 80;
  digital_container.y = 55;
  digital_container.scale = .8;
  stage.addChild(digital_container);
  var digital_back = new createjs.Shape();
  digital_back.graphics.beginFill("#FFFFFF").drawRoundRect(-100, -40, 200, 70, 2);
  digital_back.x = center_x;
  digital_back.y = 300;
  digital_back.alpha = .8;
  digital = new createjs.Text(i, "70px Roboto", "#000");
  digital.x = center_x;
  digital.y = 300;
  digital.textBaseline = "middle";
  digital.textAlign = "center";
  digital_container.addChild(digital_back, digital);

  var digital_label = new createjs.Text("Digital", "14px Mukta", "#111");
  digital_label.x = 675;
  digital_label.y = 650;
  digital_label.textBaseline = "middle";
  digital_label.textAlign = "center";
  //ABURGOS stage.addChild(digital_label);

  var button_color_container = new Array;
  var button_color = new Array;
  for (var i = 1; i <= 4; i++) {
    button_color_container[i] = new createjs.Container();
    button_color_container[i].x = 18 + (i - 1) * 38;
    button_color_container[i].y = 732;
    stage.addChild(button_color_container[i]);
    button_color[i] = new createjs.Shape();
    button_color[i].id = i;
    button_color[i].graphics.beginFill(color_list[i]).drawCircle(0, 0, 16);
    button_color[i].on("click", function (event) {
      color_change(color_list[this.id]);
      clock_angles(hour, minute);
    });
    button_color_container[i].addChild(button_color[i]);
  }

  var button_twelve_container = new createjs.Container();
  button_twelve_container.x = 625;
  button_twelve_container.y = 675;
  stage.addChild(button_twelve_container);
  var button_twelve = new createjs.Shape();
  button_twelve.graphics.beginFill("#FFFFFF").beginStroke("#000000").setStrokeStyle(4).drawRoundRect(0, 0, 70, 70, 20);
  button_twelve.on("click", function (event) {
    hour_type = 12;
    if (hour > 12) {
      hour = hour % 12;
    }
    if (hour < 1) {
      hour = hour + 12;
    }
    if (digital_container.visible) {
      am_pm.visible = true;
    }
    clock_angles(hour, minute);
  });
  var button_twelve_text = new createjs.Text("12", "44px Roboto", "#111");
  button_twelve_text.x = 32;
  button_twelve_text.y = 38;
  button_twelve_text.textBaseline = "middle";
  button_twelve_text.textAlign = "center";
  //ABURGOS button_twelve_container.addChild(button_twelve, button_twelve_text);

  var button_twenty_four_container = new createjs.Container();
  button_twenty_four_container.x = 705;
  button_twenty_four_container.y = 675;
  stage.addChild(button_twenty_four_container);
  var button_twenty_four = new createjs.Shape();
  button_twenty_four.graphics.beginFill("#FFFFFF").beginStroke("#000000").setStrokeStyle(4).drawRoundRect(0, 0, 70, 70, 20);
  button_twenty_four.on("click", function (event) {
    hour_type = 24;
    if (hour_type == 24) {
      if (hour == 12) {
        if (previous_hour == 11) {
          hour = 12;
        } else {
          hour = 0;
        }
      }
      if (am_pm_value == "PM") {
        hour = hour % 12 + 12;
      }
    }
    am_pm.visible = false;
    clock_angles(hour, minute);
  });
  var button_twenty_four_text = new createjs.Text("24", "44px Roboto", "#111");
  button_twenty_four_text.x = 35;
  button_twenty_four_text.y = 38;
  button_twenty_four_text.textBaseline = "middle";
  button_twenty_four_text.textAlign = "center";
  //ABURGOS button_twenty_four_container.addChild(button_twenty_four, button_twenty_four_text);

  var button_off_container = new createjs.Container();
  button_off_container.x = 705;
  button_off_container.y = 595;
  stage.addChild(button_off_container);
  var button_off = new createjs.Shape();
  button_off.graphics.beginFill("#FFFFFF").beginStroke("#000000").setStrokeStyle(4).drawRoundRect(0, 0, 70, 70, 20);
  button_off.on("click", function (event) {
    if (digital_container.visible) {
      digital_container.visible = false;
      am_pm.visible = false;
      button_off_text.text = "ON";
    } else {
      digital_container.visible = true;
      if (hour_type == 12) {
        am_pm.visible = true;
      }
      button_off_text.text = "OFF";
    }
  });
  var button_off_text = new createjs.Text("OFF", "30px Roboto", "#111");
  button_off_text.x = 35;
  button_off_text.y = 38;
  button_off_text.textBaseline = "middle";
  button_off_text.textAlign = "center";
  //ABURGOS button_off_container.addChild(button_off, button_off_text);

  var button_off_dotted_lines_container = new createjs.Container();
  button_off_dotted_lines_container.x = 5;
  button_off_dotted_lines_container.y = 635;
  stage.addChild(button_off_dotted_lines_container);
  var button_off_dotted_lines = new createjs.Shape();
  button_off_dotted_lines.graphics.beginFill("#FFFFFF").beginStroke("#000000").setStrokeStyle(4).drawRoundRect(0, 0, 70, 70, 20);
  button_off_dotted_lines.on("click", function (event) {
    if (hour_hand_circle.visible) {
      minute_hand_line.visible = false;
      minute_hand_circle.visible = false;
      hour_hand_line.visible = false;
      hour_hand_circle.visible = false;
      button_off_dotted_lines_text.text = "ON";
    } else {
      minute_hand_line.visible = true;
      minute_hand_circle.visible = true;
      hour_hand_line.visible = true;
      hour_hand_circle.visible = true;
      button_off_dotted_lines_text.text = "OFF";
    }
  });
  var button_off_dotted_lines_text = new createjs.Text("OFF", "30px Roboto", "#111");
  button_off_dotted_lines_text.x = 35;
  button_off_dotted_lines_text.y = 38;
  button_off_dotted_lines_text.textBaseline = "middle";
  button_off_dotted_lines_text.textAlign = "center";
  var button_off_dotted_lines_label = new createjs.Text("Dash Lines", "14px Mukta", "#111");
  button_off_dotted_lines_label.x = 80;
  button_off_dotted_lines_label.y = 35;
  button_off_dotted_lines_label.textBaseline = "middle";
  button_off_dotted_lines_label.textAlign = "left";
  //ABURGOS button_off_dotted_lines_container.addChild(button_off_dotted_lines_label, button_off_dotted_lines, button_off_dotted_lines_text);

  var button_off_hour_hand_container = new createjs.Container();
  button_off_hour_hand_container.x = 5;
  button_off_hour_hand_container.y = 5;
  stage.addChild(button_off_hour_hand_container);
  var button_off_hour_hand = new createjs.Shape();
  button_off_hour_hand.graphics.beginFill("#FFFFFF").beginStroke("#000000").setStrokeStyle(4).drawRoundRect(0, 0, 70, 70, 20);
  button_off_hour_hand.on("click", function (event) {
    if (hour_hand_container.visible) {
      hour_hand_container.visible = false;
      button_off_hour_hand_text.text = "ON";
    } else {
      hour_hand_container.visible = true;
      button_off_hour_hand_text.text = "OFF";
    }
  });
  var button_off_hour_hand_text = new createjs.Text("OFF", "30px Roboto", "#111");
  button_off_hour_hand_text.x = 35;
  button_off_hour_hand_text.y = 38;
  button_off_hour_hand_text.textBaseline = "middle";
  button_off_hour_hand_text.textAlign = "center";
  var button_off_hour_hand_label = new createjs.Text("Hour Hand", "14px Mukta", "#111");
  button_off_hour_hand_label.x = 80;
  button_off_hour_hand_label.y = 35;
  button_off_hour_hand_label.textBaseline = "middle";
  button_off_hour_hand_label.textAlign = "left";
  //ABURGOS button_off_hour_hand_container.addChild(button_off_hour_hand_label, button_off_hour_hand, button_off_hour_hand_text);

  var button_off_minute_hand_container = new createjs.Container();
  button_off_minute_hand_container.x = 705;
  button_off_minute_hand_container.y = 5;
  stage.addChild(button_off_minute_hand_container);
  var button_off_minute_hand = new createjs.Shape();
  button_off_minute_hand.graphics.beginFill("#FFFFFF").beginStroke("#000000").setStrokeStyle(4).drawRoundRect(0, 0, 70, 70, 20);
  button_off_minute_hand.on("click", function (event) {
    if (minute_hand_container.visible) {
      minute_hand_container.visible = false;
      button_off_minute_hand_text.text = "ON";
    } else {
      minute_hand_container.visible = true;
      button_off_minute_hand_text.text = "OFF";
    }
  });
  var button_off_minute_hand_text = new createjs.Text("OFF", "30px Roboto", "#111");
  button_off_minute_hand_text.x = 35;
  button_off_minute_hand_text.y = 38;
  button_off_minute_hand_text.textBaseline = "middle";
  button_off_minute_hand_text.textAlign = "center";
  var button_off_minute_hand_label = new createjs.Text("Minute Hand", "14px Mukta", "#111");
  button_off_minute_hand_label.x = -10;
  button_off_minute_hand_label.y = 35;
  button_off_minute_hand_label.textBaseline = "middle";
  button_off_minute_hand_label.textAlign = "right";
  //ABURGOS button_off_minute_hand_container.addChild(button_off_minute_hand, button_off_minute_hand_text, button_off_minute_hand_label);

  clock_angles(hour, minute);

  function minute_move(angle) {
    var amount = Math.round(((angle + 90) / 360) * 60);
    if (amount < 0) {
      amount += 60;
    }
    return amount;
  }

  function find_hour_minute(angle) {
    var limit;
    if (angle >= 150) {
      limit = 150;
      hour = 8;
    } else
    if (angle >= 120) {
      limit = 120;
      hour = 7;
    } else
    if (angle >= 90) {
      limit = 90;
      hour = 6;
    } else
    if (angle >= 60) {
      limit = 60;
      hour = 5;
    } else
    if (angle >= 30) {
      limit = 30;
      hour = 4;
    } else
    if (angle >= 0) {
      limit = 0;
      hour = 3;
    } else
    if (angle >= -30) {
      limit = -30;
      hour = 2;
    } else
    if (angle >= -60) {
      limit = -60;
      hour = 1;
    } else
    if (angle >= -90) {
      limit = -90;
      hour = 12;
    } else
    if (angle >= -120) {
      limit = -120;
      hour = 11;
    } else
    if (angle >= -150) {
      limit = -150;
      hour = 10;
    } else
    if (angle >= -180) {
      limit = -180;
      hour = 9;
    } else {
      limit = -180;
      hour = 9;
    }
    if (hour_type == 24) {
      if (hour == 12) {
        if (previous_hour == 11) {
          hour = 12;
        } else {
          hour = 0;
        }
      }
      if (am_pm_value == "PM") {
        hour = hour % 12 + 12;
      }
    }
    minute = minute_positions(angle, limit);
  }

  function minute_positions(angle, limit) {
    return Math.floor((angle - limit) * 2);
  }

  function clock_angles(hour, minute) {
    var minAngle = 360 * (minute / 60) - 90;
    var hourAngle = 360 * (hour / 12) + 30 * (minute / 60) - 90;
    minute_hand_container.rotation = minAngle;
    hour_hand_container.rotation = hourAngle;
    previous_hour = hour;

    //ABURGOS
    //window.hour = hour;
    //window.minute = minute;
    window.dispatchEvent(new CustomEvent('timeClockAssigned', {
      detail: { hour: hour, minute: minute }
    }));

    set_digital(hour, minute);

  }

  function hour_increase() {
    if (hour < hour_type) {
      hour++;
    } else {
      hour = 1;
    }
    if (hour == 24) {
      hour = 0;
    }
  }

  function hour_decrease() {
    if (hour > 1) {
      hour--;
    } else {
      hour = hour_type;
    }
    if (hour == 24) {
      hour = 23;
    }
  }

  function set_digital(hour, minute) {
    var minute_extra = "";
    if (minute < 10) {
      minute_extra = "0";
    }
    var hour_extra = "";
    if (hour_type == 24 && hour < 10) {
      hour_extra = "0";
    }
    digital.text = hour_extra + hour + ":" + minute_extra + minute;
  }

  function check_am_pm(change_am_pm) {
    var change_am_pm = change_am_pm;
    if (!change_am_pm) {
      if (previous_hour == 11 && hour == 12) {
        change_am_pm = true;
      } else
      if (previous_hour == 12 && hour == 11) {
        change_am_pm = true;
      } else
      if (previous_hour == 23 && hour == 0) {
        change_am_pm = true;
      } else
      if (previous_hour == 0 && hour == 23) {
        change_am_pm = true;
      }
    }
    if (change_am_pm) {
      if (am_pm_value == "AM") {
        am_pm_value = "PM";
      } else {
        am_pm_value = "AM";
      }
    }
    am_pm.text = am_pm_value;
  }

  function color_change(color) {
    circle_back_fill.style = color;
    for (var i = 1; i <= 12; i++) {
      hour_lines_fill[i].style = color;
    }
    for (var i = 1; i <= 60; i++) {
      var radians = (-60 + ((i - 1) * 6)) / 180 * Math.PI;
      minute_lines_fill[i].style = color;
    }
    minute_hand_fill.style = color;
  }

  function getDirection(p1, p2, p3, p4) {
    var dx = p1 - p2;
    var dy = p3 - p4;
    var radians = Math.atan2(dy, dx);
    // return radians
    var angle = radians * 180 / Math.PI;
    return angle;
  }

  function getDistance(p1, p2, p3, p4) {
    var dx = p1 - p2;
    var dy = p3 - p4;
    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist;
  }
}
