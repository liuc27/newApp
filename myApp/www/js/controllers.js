angular.module('starter.controllers', [])

    .controller('CouponCtrl', function ($scope, localStorageService, types, things, possessionData) {

            console.log(things)
            $scope.items = things.data
            console.log(possessionData.data)
            $scope.find = function(item) {
                var exist = false;
                angular.forEach(possessionData.data, function (value) {
                    if (value == item._id) {
                        exist = true;
                    }
                });
                return exist;
            }
    })

    .controller('typesCtrl', function ($scope, types) {
        $scope.types = types.all();
    })

    .controller('typeDetailCtrl', function ($scope, $stateParams, types, things, possessionData) {
        $scope.type = types.get($stateParams.typeId).type;
        console.log($scope.type)
        $scope.items = things.data;

        $scope.find = function(item) {
            var exist = false;
            angular.forEach(possessionData.data, function (value) {
                if (value == item._id) {
                    exist = true;
                }
            });
            return exist;
        }
    })

    .controller('CouponDetailCtrl', function ($scope, $stateParams, localStorageService, $ionicPopup, types, $http, things, preLoadAccount,possessionData) {

        $scope.items = things.data;
        $scope.possession = possessionData.data
        $scope.username = preLoadAccount ? preLoadAccount : $scope.username

        $scope.rate = 3;
        $scope.max = 5;
        console.log("stateParams are");
        console.log($stateParams);
        console.log(possessionData.data)
        $scope.coupon = types.fetch($stateParams.couponId);
        $scope.favorites = "button icon-left ion-plus button-positive";
        $scope.favoritesText = "点击领取";
        $scope.commentLength = types.getCommentLength($scope.coupon.comment)

        $scope.clicked = false;
        $scope.comment = types.comment($stateParams.couponId);
$scope.showComment = false;
        console.log($scope.comment)
        var theNewCoupon = angular.copy($scope.coupon);
        //$scope.comment.push({"text":theNewCoupon.productName})
        $scope.changeShowComment = function() {
            $scope.showComment = !$scope.showComment
        }
        $scope.submitComment = function () {
            var couponName = $scope.coupon.name
            $http.post("http://localhost:3000/api/comment",{
                "name": couponName,
                "comment": $scope.comment.comment
            }).success(function (data) {
                console.log(data)
console.log($scope.showComment)
                $scope.showComment = !$scope.showComment

                $scope.comment = data[0].comment
                $scope.commentLength++;
                things.data[$stateParams.couponId].comment = data[0].comment
            })
        };

        $scope.changeClass = function () {
            var couponName = $scope.coupon.name

                    console.log($scope.username)

            var _id = $scope.coupon._id
            if ($scope.favoritesText === "点击领取") {
                console.log(possessionData)
                console.log($scope.username)
                console.log(_id)
                $http.post("http://localhost:3000/api/add", {
                    "name": couponName,
                    "username": $scope.username,
                    "_id": _id

                }).success(function (data) {
                    if (data === "couldn't find") {
                        $ionicPopup.alert({
                            title: '非常抱歉,库存不足'
                        })
                        $scope.favoritesText = "无法领取"
                    } else {
                        $ionicPopup.alert({
                            title: '恭喜,成功领取!'
                        });
                        console.log(typeof possessionData)
                        console.log(typeof possessionData.data)

                        possessionData.data.push(_id);

                        $scope.favoritesText = "已经领取"
                        $scope.favorites = "button icon-left ion-heart button-positive"
                        $scope.coupon.numbers = data
                        //console.log(data)
                    }
                })
            }
        }

        $scope.favoriteClass = function () {
            var exist = false
            angular.forEach(possessionData.data, function (value) {
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
    })
    .controller('favoriteListCtrl', function ($scope, $stateParams, localStorageService, types, things, possessionData) {
        //localStorageService.clearAll()
        $scope.items = things.data;
        $scope.possession = possessionData.data;
    })
    .controller('AccountCtrl', function ($scope, types, $http, $ionicSideMenuDelegate, localStorageService,$state,$q) {

    })
    .controller('MenuCtrl', function ($scope, types, $http, $ionicSideMenuDelegate, localStorageService,$state,$q) {

    })
    .controller('registerCtrl', function ($scope,$rootScope, $ionicPopup, $ionicSideMenuDelegate,localStorageService, types, $http, $state, $q, preLoadAccount) {

        $scope.username = preLoadAccount ? preLoadAccount: localStorageService.get("usernameData")
        $scope.usernameExist = preLoadAccount
        $scope.register = function (username, password) {
            $http.post("http://localhost:3000/api/register", {
                "username": username,
                "password": password
            }).success(function (data) {
                if (data === "already registered") {
                    $ionicPopup.alert({
                        title: '用户名已经注册，请换用户名！'
                    });
                } else {
                    $rootScope.username = username
                    $scope.username = username
                    $scope.usernameExist = true
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
                        //console.log(localStorageService.get("usernameData"));
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

    });
