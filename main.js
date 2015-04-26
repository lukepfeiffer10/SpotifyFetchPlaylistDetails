/// <reference path="jquery-2.1.3.js"/>
/// <reference path="backbone.js"/>
/// <reference path="underscore.js"/>

$(function () {

    var Playlist = Backbone.Model.extend({
        defaults: {
            name: "",
            images: [],
            tracks: {}
        }
    });

    var Playlists = Backbone.Collection.extend({
        model: Playlist,

        render: function() {
            _.each(this, function(playlist) {
                var pView = new PlaylistView(playlist);
                pView.render();
            });
        }
    });

    var playlists = new Playlists();

    var PlaylistView = Backbone.View.extend({
        tagname: "div",

        attributes: {
            style: "float:left;"
        },

        template: _.template($("#playlistTemplate").html()),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var AppView = Backbone.View.extend({
        el: $("#mainContent"),

        events: {
            "click #submit": "search"
        },

        initialize: function() {
            
        },

        search: function () {
            var _this = this;
            var $searchResultsDiv = _this.$el.find("#searchResults");
            $searchResultsDiv.children().remove();
            playlists.models = [];

            $.ajax({
                type: "GET",
                url: "https://api.spotify.com/v1/search",
                data: {
                    q: $("#search").val(),
                    type: "playlist"
                },
                success: function (data) {
                    playlists.add(data.playlists.items.map(function(d) {
                        return {
                            name: d.name,
                            tracks: d.tracks,
                            images: d.images.filter(function (i) { return i.width === 300 && i.height === 300})
                    };
                    }));
                    
                    _.each(playlists.models, function (playlist) {
                        var pView = new PlaylistView({ model: playlist });
                        $searchResultsDiv.append(pView.render().$el);
                    }, _this);
                }
            });
        }
    });

    var App = new AppView();
});