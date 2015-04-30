angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('types', function ($rootScope, $http, localStorageService, $q, $state,$ionicPopup) {
        var items = [];
        var checked = new Array();
        var username;
        var possession = [];
        username = localStorageService.get("usernameData")
        //localStorageService.clearAll();

        console.log(localStorageService.get("usernameData"))

        if(username === null){
            $ionicPopup.alert({
                title: '请注册帐号'
            });
            setTimeout(function() {
                $state.go('tab.register');
            },100)
        }else{
            $ionicPopup.alert({
                title: '已登录帐号: ' + username
            });
            console.log(username)
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
                var x = [];
                angular.forEach(items, function (value) {
                    if (value.id == couponId) {
                            x = value;
                    }
                })
                return x;
            },
            fetchFavorite: function (couponId) {
                return checked[couponId];
            },
            getCommentLength: function(comment) {
                if (typeof comment === "undefined") {
                    return 0
                } else{
                    return comment.length;
                }
            },
            allItems: function () {
                return  $http.get("http://120.24.168.7:3000/api/posts").success(function (data) {
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
                return $http.post("http://120.24.168.7:3000/api/user", {
                    "username": localStorageService.get("usernameData")
                }).success(function (data) {
                    console.log(data);
                    if (data == "not exist"){
                        localStorageService.remove("usernameData");
                        username = null;
                    }else{
                        return data;
                    }
                })
            },
            autoLoginAccount: function(){
                return username;
            }
        }
    });

