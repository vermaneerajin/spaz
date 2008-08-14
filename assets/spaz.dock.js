if (!Spaz.dock) Spaz.dock = {};

/***********
Spaz.dock takes care of the docking
***********/

Spaz.dock.init = function() {

   // Only on OSX
   Spaz.dock.active = air.NativeApplication.supportsDockIcon;

   //
   if (!Spaz.dock.active)
   {
      return;
   }

   // Create the text format
   var format = new window.runtime.flash.text.TextFormat();
   format.size = 30;
   format.color = 0xFFFFFF;
   format.bold = true;
   format.font = 'Arial';
   air.trace("Dock text format created");

   // Load the image async
   var imageURL = 'images/spaz-icon-alpha.png';
   air.trace("Want to load image " + imageURL);
   var loader = new air.Loader();
   loader.contentLoaderInfo.addEventListener(air.Event.COMPLETE, function(event)
   {
      air.trace("Loaded image " + imageURL);
      Spaz.dock.bitmapData = event.target.content.bitmapData;
   }, false, 0, true);
   loader.load(new air.URLRequest(imageURL));

   // Save for later use
   Spaz.dock.icon = air.NativeApplication.nativeApplication.icon;
   Spaz.dock.textFormat = format;
   Spaz.dock.padding = 4;
   Spaz.dock.border = 5;

   // Install the refresh timer to 1/2 second which seems a reasonable value
   window.setInterval(Spaz.dock.refresh, 500);
}

Spaz.dock.refresh = function(unreadCount)
{
   if (!Spaz.dock.active)
   {
      return;
   }

   //
   if (typeof unreadCount == 'undefined')
   {
      unreadCount = $("#timeline-friends div.timeline-entry").size() - $("#timeline-friends div.timeline-entry.read").size();   
   }

   //
   if (unreadCount == Spaz.dock.lastUnreadCount)
   {
      return;
   }

   // Use the original icon if count is zero
   if (unreadCount == 0)
   {
      // Update state
      Spaz.dock.icon.bitmaps = [Spaz.dock.bitmapData];
      Spaz.dock.lastUnreadCount = 0;
      return;
   }

   //
   var tf = new window.runtime.flash.text.TextField();
   tf.defaultTextFormat = Spaz.dock.textFormat;
   tf.text = "" + unreadCount;
   tf.wordWrap = true;

   // Clone the bitmap
   var clone = Spaz.dock.bitmapData.clone();

   // Draw the text in a buffer
   var buffer = new window.runtime.flash.display.BitmapData(
      256,
      256,
      true,
      0);
   buffer.draw(tf);

   // Compute the bounding box, we cannot use TextField.textWidth and TextField.textHeight as
   // they return approximation which results into incorrect display
   var xmin = 0;
   var ymin = 0;
   var xmax = tf.textWidth;
   var ymax = tf.textHeight;
   var width = xmax - xmin;
   var height = ymax - ymin;

   // Compute the ellipse dimensions
   var eH = (width / (Math.sqrt(2)));
   var eY = (height / (Math.sqrt(2)));

   // Correct the dimension if the ellipse width is lesser than the ellipse height
   if (eH < eY)
   {
      eH = eY;
   }

   // Compute the inner and outter ellipses
   var innerW = eH + Spaz.dock.padding;
   var innerH = eY + Spaz.dock.padding;
   var outterW = eH + Spaz.dock.padding + Spaz.dock.border;
   var outterH = eY + Spaz.dock.padding + Spaz.dock.border;

   // Draw the shape
   var shape = new window.runtime.flash.display.Shape();
   Spaz.dock.drawPolygon(
      shape.graphics,
      outterW,
      outterH,
      innerW,
      innerH,
      outterW,
      outterH,
      30);
   clone.draw(shape);

   // Copy the text on top of the shape
   clone.copyPixels(
      buffer,
      new window.runtime.flash.geom.Rectangle(xmin, ymin, width, height),
      new window.runtime.flash.geom.Point(outterW - width / 2, outterH - height / 2),
      null,
      null,
      true);

   // Update state
   Spaz.dock.icon.bitmaps = [clone];
   Spaz.dock.lastUnreadCount = unreadCount;
}

Spaz.dock.drawPolygon = function(graphics, centerX, centerY, innerW, innerH, outterW, outterH, size)
{
   var delta = (Math.PI * 2) / size;
   var angle = 0;
   var xs = [];
   var ys = [];
   for (var i = 0;i < size;i++)
   {
      angle = delta * i + (Math.PI / 2);
      var x1 = centerX + outterW * Math.cos(angle) + 0.5;
      var y1 = centerY - outterH * Math.sin(angle) + 0.5;
      angle += delta / 2;
      var x2 = centerX + innerW * Math.cos(angle) + 0.5;
      var y2 = centerY - innerH * Math.sin(angle) + 0.5;

      //
      xs.push(x1);
      ys.push(y1);
      xs.push(x2);
      ys.push(y2);
   }

   // Draw the inner
   var fillType = window.runtime.flash.display.GradientType.LINEAR;
   var colors = [0xFF0000, 0xAA0000];
   var alphas = [1, 1];
   var ratios = [0x00, 0xFF];
   var matr = new window.runtime.flash.geom.Matrix();
   matr.createGradientBox(outterW * 2, 0, 0, 0, 0);
   var spreadMethod = window.runtime.flash.display.SpreadMethod.PAD;
   graphics.beginGradientFill(fillType, colors, alphas, ratios, matr, spreadMethod);

   //
   graphics.lineStyle(
      2,
      0x660000,
      1,
      false,
      window.runtime.flash.display.LineScaleMode.NORMAL,
      window.runtime.flash.display.CapsStyle.NONE,
      window.runtime.flash.display.JointStyle.MITER,
      3);

   //
   for (var j in xs)
   {
      if (j == 0)
      {
         graphics.moveTo(xs[j], ys[j]);
      }
      else
      {
         graphics.lineTo(xs[j], ys[j]);
      }
   }

   //
   graphics.endFill();

   // Draw the perimeter
//   graphics.lineStyle(
//      3,
//      0xFF,
//      1,
//      false,
//      window.runtime.flash.display.LineScaleMode.NORMAL,
//      window.runtime.flash.display.CapsStyle.NONE,
//      window.runtime.flash.display.JointStyle.MITER,
//      3);
//   for (var j in xs)
//   {
//      if (j == 0)
//      {
//         graphics.moveTo(xs[j], ys[j]);
//      }
//      else
//      {
//         graphics.lineTo(xs[j], ys[j]);
//      }
//   }
//   graphics.lineTo(xs[0], ys[0]);
}
