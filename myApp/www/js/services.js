angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('types', function ($rootScope, $http, localStorageService, $q, $state,$ionicPopup) {
        var items = [];
        var checked = new Array();
        var xxxxx, username;
        var possession = [];
        xxxxx = localStorageService.get("usernameData")

        //localStorageService.clearAll();

        console.log(localStorageService.get("usernameData"))

        if(xxxxx === null){
            $ionicPopup.alert({
                title: '请注册帐号'
            });
            setTimeout(function() {
                $state.go('tab.register');
            },100)

        }else{
            $ionicPopup.alert({
                title: '已登录帐号: ' + xxxxx
            });
            console.log(xxxxx)
            setTimeout(function() {
                $state.go('tab.coupon');
            },100)

        }

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
                return  $http.get("http://localhost:3000/api/posts").success(function (data) {
                    console.log(data.length)
                    console.log(data)
                    items = data
                    return data
                })
            },
            favoriteList: function () {
                return checked;
            },
            comment: function (couponId) {
                return (items[couponId].comment) ? items[couponId].comment : false;
            },
            checkPossession: function(){
                return $http.post("http://localhost:3000/api/user", {
                    "username": localStorageService.get("usernameData")
                }).success(function (data) {
                    return data;
                })
            },
            autoLoginAccount: function(){
                return xxxxx
            }
        }
    });

