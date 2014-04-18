(function($, window) {
	// initialize
	(function() {
		var downloadsRef = new Firebase("https://calligraphybook.firebaseio.com/downloads");
		downloadsRef.on("value", function(snapshot) {
			var currVal = snapshot.val();
			if (currVal == null) {
				currVal = {};
			} else {
				currVal = snapshot.val();
			}

			(function() {
				$(".download").each(function() {
					var id = $(this).attr("id");
					if (id in currVal) {
						var count = currVal[id];
						$(this).attr("title", "下載次數：" + count);
					}
				});
			})();
		});
	})();

	// listen to download
	(function() {
		$(".download").click(function() {
			var eleId = $(this).attr("id");
			var eleUrl = $(this).attr("url");

			var deferred = $.Deferred();

			var downloadRef = new Firebase("https://calligraphybook.firebaseio.com/downloads/" + eleId);
			var currCount;
			var initStats = function() {
					downloadRef.once("value", function(snapshot) {
						currCount = snapshot.val() ? parseInt(snapshot.val()) : 0;
						deferred.resolve();
					});

					return deferred;
				};

			var updateStats = function() {
					downloadRef.set(currCount + 1, function(error) {
						if (error) {
							deferred.reject();
						} else {
							deferred.resolve();
						}
					});

					return deferred.promise();
				};

			var downlodFile = function() {
					$.fileDownload(eleUrl);
				};

			initStats().done(updateStats).always(downlodFile);
		});
	})();
})(jQuery, window);