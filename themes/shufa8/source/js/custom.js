(function($, window){
	var downloads = null;
	var downloadsRef = new Firebase("https://calligraphybook.firebaseio.com/downloads");

	(function(){
		$(".download").click(function(){
			var eleId = $(this).attr("id");
			var eleUrl = $(this).attr("url");

			var deferred = $.Deferred();

			var initStats = function(){
				if(downloads == null){
					downloads = {};

					downloadsRef.once("value",function(snapshot){
						var currVal = snapshot.val() ? snapshot.val() : {};
						for(var id in currVal){
							downloads[id] = parseInt(currVal[id]);
						}

						deferred.resolve();
					});
				} else {
					deferred.resolve();
				}

				return deferred;		
			};

			var updateStats = function(){
				if(downloads[eleId] == null){
					downloads[eleId] = 0;
				}
				downloads[eleId]++;
				downloadsRef.child(eleId).set(downloads[eleId],function(error){
					if(error){
						deferred.reject();
					} else {
						deferred.resolve();
					}
				});

				return deferred.promise();
			};

			var downlodFile = function(){
				$.fileDownload(eleUrl);
			};

			initStats().done(updateStats).always(downlodFile);
		});
	})();

	(function(){		
		downloadsRef.on("value", function(snapshot){
			var currVal = snapshot.val();
			if( currVal == null){
				currVal = {};
			} else {
				currVal = snapshot.val();
			}
			
			(function(){
				$(".download").each(function(){
					var id = $(this).attr("id");
					if(id in currVal){
						var count = currVal[id];
						$(this).attr("title","下載次數：" + count);
					}
				});
			})();
		});
	})();
})(jQuery, window);