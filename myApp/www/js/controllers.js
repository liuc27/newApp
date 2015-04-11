angular.module('starter.controllers', [])

    .controller('CouponCtrl', function ($scope, localStorageService, types) {

        setTimeout(function() {

            $scope.items = types.allItems()
            $scope.checked = types.favoriteList()
            console.log(types.checkPossession())
            $scope.find = function(item) {
                var exist = false;
                angular.forEach(types.checkPossession(), function (value) {
                    if (value == item._id) {
                        exist = true;
                    }
                });
                return exist;
            }
        },100);
    })

    .controller('typesCtrl', function ($scope, types) {
        $scope.types = types.all();
    })

    .controller('typeDetailCtrl', function ($scope, $stateParams, types) {
        $scope.type = types.get($stateParams.typeId);
        $scope.items = types.allItems();
    })

    .controller('CouponDetailCtrl', function ($scope, $stateParams, localStorageService, $ionicPopup, types, $http) {

        $scope.items = types.allItems();
        console.log("stateParams are");
        console.log($stateParams);
        console.log($scope.items)
        $scope.coupon = types.fetch($stateParams.couponId);
        $scope.favorites = "button icon-left ion-plus button-positive";
        $scope.favoritesText = "点击领取";
        $scope.commentLength = function(comment){
            if (comment.length) {
                return comment.length;
            }else{
                return 0;
            }
        }

        $scope.clicked = false;
        $scope.comment = types.comment($stateParams.couponId);

        console.log($scope.comment)
        var theNewCoupon = angular.copy($scope.coupon);
        //$scope.comment.push({"text":theNewCoupon.productName})

        $scope.submitComment = function () {
            var couponName = $scope.coupon.name
            $http.post("http://localhost:3000/api/comment",{
                "name": couponName,
                "comment": $scope.comment.comment
            }).success(function (data) {
                console.log(data)
                $scope.comment = data[0].comment
            })
        };

        $scope.changeClass = function () {
            var couponName = $scope.coupon.name
            var username = $scope.showAlreadyRegistered
            var _id = $scope.coupon._id
            if ($scope.favoritesText === "点击领取") {
                $http.post("http://localhost:3000/api/add", {
                    "name": couponName,
                    "username": username,
                    "_id": _id

                }).success(function (data) {
                    if (data === "couldn't find") {
                        $ionicPopup.alert({
                            title: '非常抱歉,库存不足'
                        });
                        $scope.favoritesText = "无法领取";
                    } else {
                        $ionicPopup.alert({
                            title: '恭喜,成功领取!'
                        });
                        $scope.favoritesText = "已经领取";
                        $scope.favorites = "button icon-left ion-heart button-positive";
                        $scope.coupon.numbers = data;
                        console.log(data);
                    }
                })
            }
        }

        $scope.favoriteClass = function () {
            var exist = false
            angular.forEach(types.checkPossession(), function (value) {
                if (value == $scope.coupon._id) {
                    exist = true;
                }
            })
            if (exist) {
                $scope.favorites = "button icon-left ion-heart button-positive";
                $scope.favoritesText = "已经领取";
                $scope.isDisabled = true
            }
        };
        /*


         $scope.changeClass = function () {
         var couponName = $scope.coupon.name
         if ($scope.favoritesText === "点击领取" && $scope.clicked == false) {
         var notExist = true;
         $scope.clicked = true;
         angular.forEach($scope.checked, function (value) {
         if (value._id == $scope.coupon._id) {
         notExist = false;
         }
         });
         if (notExist) {
         $http.post("http://localhost:3000/api/add", {
         "name": couponName
         }).success(function (data) {
         if (data === "couldn't find") {
         $ionicPopup.alert({
         title: '非常抱歉,库存不足'
         });
         $scope.favoritesText = "无法领取";
         } else {
         $ionicPopup.alert({
         title: '恭喜,成功领取!'
         });
         $scope.favoritesText = "已经领取";
         $scope.favorites = "button icon-left ion-heart button-positive";
         $scope.items[$scope.coupon.id].numbers--
         var newCoupon = angular.copy($scope.coupon);

         console.log(newCoupon)
         $scope.checked.push({"_id":newCoupon._id})
         console.log(newCoupon._id)
         var newCoupon = angular.copy($scope.checked)
         localStorageService.set("checkedData", $scope.checked);
         }
         });
         }
         }
         }*/
    })

    .controller('favoriteListCtrl', function ($scope, $stateParams, localStorageService, types) {
        //localStorageService.clearAll()
        $scope.types = types.all();
        $scope.items = types.allItems();
        $scope.coupon = types.fetch($stateParams.couponId);
        $scope.favorites = "button icon-left ion-plus button-positive";
        $scope.favoritesText = "点击领取";
        $scope.possession = types.checkPossession();
    })

    .controller('favoriteDetailCtrl', function ($scope, $stateParams, localStorageService, types, $http) {
        console.log(parseInt($stateParams.favoriteId))
        if (localStorageService.get("checkedData")) {
            $scope.checked = localStorageService.get("checkedData")
        }
        console.log($scope.checked)
        $scope.items = types.allItems();
        angular.forEach($scope.checked, function (value) {
            if (value.id == $stateParams.favoriteId) {
                $scope.favoriteCoupon = value;
                console.log(value)
            }
        });
        //$scope.favoriteCoupon = $scope.checked[parseInt($stateParams.favoriteId)];
        console.log("favoriteCoupon is")
        console.log($stateParams)
        $scope.checked = types.favoriteList();
        $scope.favorites = "button icon-left ion-plus button-positive";
        $scope.favoritesText = "点击领取";
        $scope.changeClass = function () {
            if ($scope.favorites === "button icon-left ion-plus button-positive") {
                $scope.favorites = "button icon-left ion-heart button-positive";
                if ($scope.favoritesText === "点击领取")
                    $scope.favoritesText = "已经领取";
            }
        };


        $scope.clicked = false;
        $scope.comment = $scope.favoriteCoupon.comment;
        var theNewCoupon = angular.copy($scope.coupon);

        $scope.submitComment = function () {
            var couponName = $scope.favoriteCoupon.name
            $http.post("http://localhost:3000/api/comment",{
                "name": couponName,
                "comment": $scope.comment.comment
            }).success(function (data) {
                console.log(data)
                $scope.comment = data[0].comment
            })
        };

    })
    .controller('MenuCtrl', function ($scope, types, $http, $ionicSideMenuDelegate, localStorageService,$state,$q) {

    })
    .controller('AccountCtrl', function ($scope,$ionicPopup, $ionicSideMenuDelegate,localStorageService, types, $http,$state,$q) {


        $scope.showAlreadyRegistered = types.getUserName()

        $scope.register = function (username, password) {
            $http.post("http://localhost:3000/api/user", {
                "username": username,
                "password": password
            }).success(function (data) {
                if (data === "already registered") {
                    $ionicPopup.alert({
                        title: '用户名已经注册，请换用户名！'
                    });
                } else {
                    $ionicPopup.alert({
                        title: '注册成功！已自动登录!'
                    });

                    var promise = $q(function(resolve, reject) {
                        setTimeout(function() {
                            if (localStorageService.set("usernameData", username)) {
                                resolve('开始抢折扣卷吧!');
                            } else {
                                reject('出错咯,开始抢折扣卷吧!');
                            }
                        }, 10);
                    });

                    promise.then(function(greeting) {
                        //console.log(localStorageService.get("usernameDate"));
                        //alert('Success: ' + greeting);
                        $state.go('tab.coupon');
                    }, function(reason) {
                        //alert('Failed: ' + reason);
                        $state.go('tab.coupon');
                    });

                }
            });
        };

        $scope.showTab = function(){
            $scope.showAccountTab = true;
        }

    })

    .controller('MyCtrl', function ($scope, types, $http, localStorageService, $state) {
        $scope.doRefresh = function () {
        }

        /*
         reloadBroad($state.reload())
         function reloadBroad() {
         $scope.$broadcast('scroll.refreshComplete')
         }
         */
        $scope.currentTime = new Date();
        $scope.items = types.allItems();

    });
