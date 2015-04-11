angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('types', function ($rootScope, $http, localStorageService, $q, $state,$ionicPopup) {
        var items = [];
        var checked = new Array();
        var showAlreadyRegistered = null;
        var xxxxx,possession=[];

        var promise1 = $q(function(resolve, reject) {
            setTimeout(function() {

                if (xxxxx = localStorageService.get("usernameData")) {
                    resolve(xxxxx);
                } else {
                    reject('出错咯,开始抢折扣卷吧!');
                }
            }, 10);
        });
        //localStorageService.clearAll();
        promise1.then(function(xxxxxx) {
            //console.log(localStorageService.get("usernameDate"));
            $ionicPopup.alert({
                title: '已登录帐号: ' + xxxxxx
            });
            showAlreadyRegistered = xxxxxx
            $http.post("http://localhost:3000/api/user", {
                "username": xxxxxx,
            }).success(function (data) {
                possession = data;
                console.log(possession)
            })
            $state.go('tab.coupon');
        }, function(reason) {
            $ionicPopup.alert({
                title: '请注册帐号'
            });
            $state.go('tab.register');
        });

        var i, theChecked = new Array();
        var types = [
            {
                id: 0,
                name: '饮食',
                type: 'food'
            },
            {
                id: 1,
                name: '购物',
                type: 'shopping'
            },
            {
                id: 2,
                name: '美容',
                type: 'beauty'
            },
            {
                id: 3,
                name: '住行',
                type: 'hotel'
            }
        ];

        $http.get("http://localhost:3000/api/posts").success(function (data) {
            console.log(data.length)
            console.log(data)
            items = data
        })

        return {
            all: function () {
                return types;
            },
            get: function (typeId) {
                return types[typeId];
            },
            fetch: function (couponId) {
                return items[couponId];
            },
            fetchFavorite: function (couponId) {
                return checked[couponId];
            },
            allItems: function () {
                return items
            },
            favoriteList: function () {
                return checked;
            },
            comment: function (couponId) {
                return items[couponId].comment
            },
            getUserName: function(){
                return showAlreadyRegistered
            },
            checkPossession: function(){
                return possession
            }
        }
    });


/*
 if (localStorageService.get("checkedData")) {
 checked = localStorageService.get("checkedData")
 }
 for (var i = 0; i < data.length; i++) {
 var x = data[i];
 angular.forEach(checked, function (value) {
 if (value._id == x._id) {
 theChecked.push(x)
 }
 checked = theChecked
 //localStorageService.set("checkedData", theChecked)
 });
 }
 */
//$rootScope.$broadcast('myService:getUserConfigSuccess');