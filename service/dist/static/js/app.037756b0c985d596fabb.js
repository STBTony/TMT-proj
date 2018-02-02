webpackJsonp([1],{0:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("7+uW"),n={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"loading-screen"},[e("div",{staticClass:"spinner",style:this.styles})])},staticRenderFns:[]};var i=a("VU/8")({props:{size:{default:"50px"}},computed:{styles:function(){return{width:this.size,height:this.size}}}},n,!1,function(t){a("TmX0")},"data-v-f86c277a",null).exports,r=["girl","guitar","piano","record"],l={name:"App",components:{LoadingScreen:i},data:function(){return{preloading:!1,image:"static/img/"+r[Math.floor(4*Math.random())]+"-min.jpg"}},mounted:function(){setTimeout(function(){this.preloading=!1},1e3)}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"app"}},[t.preloading?t._e():a("div",[a("div",{style:{backgroundImage:"url("+t.image+")"},attrs:{id:"bg"}}),t._v(" "),a("h1",{staticClass:"title unselectable"},[t._v("TMT Music Playlist Generator")]),t._v(" "),a("div",{attrs:{id:"overlay"}}),t._v(" "),a("router-view")],1),t._v(" "),t.preloading?a("loading-screen"):t._e(),t._v(" "),t._m(0)],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"credit"},[e("span",{attrs:{id:"left"}},[this._v("A TMT Project.")]),this._v(" "),e("span",{attrs:{id:"right"}},[this._v("Built with passion and pain by "),e("a",{attrs:{target:"_blank",href:"https://tontytont.github.io"}},[this._v("Tontytont")]),this._v(".")])])}]};var c=a("VU/8")(l,o,!1,function(t){a("jZEs")},null,null).exports,d=a("/ocq"),g={name:"Generator",components:{LoadingScreen:i},data:function(){return{msg:"Welcome to the heaven of freshly generated playlist.",exportMsg:"Export Playlist!",generateMsg:"Create a Playlist!",bpm:120,listLength:30,duration:30,genre:"ALL",loading:!0,data:{trackList:[],playlistURL:null}}},mounted:function(){this.loading=!1},methods:{getTrackList:function(){var t=this;console.log(bpm),this.bpm<=0||this.bpm>300||this.listLength<0||this.listLength>300?this.msg="Those values are not valid!\n":(this.loading=!0,this.$http.get("/api/v1/generate",{params:{bpm:this.bpm,duration:this.duration,genre:this.genre,listLength:this.listLength}}).then(function(e){t.data.trackList=e.body,console.log(e.body),t.data.playlistURL=null,t.loading=!1,0!==t.data.trackList.length?(setTimeout(function(){window.scroll({top:800,left:0,behavior:"smooth"})},0),t.generateMsg="Create another one!",t.msg="Enjoy your playlist!"):t.generateMsg="Something went wrong! Try again."},function(e){t.loading=!1,t.generateMsg="Something went wrong! Try again.",console.log(e)}))},createPlaylist:function(){var t=this;this.loading=!0,this.$http.post("/api/v1/create-playlist",{name:"HIPEASS "+this.bpm+" BPM  NEW ON SPOTIFY PLAYLIST",trackList:this.data.trackList}).then(function(e){t.loading=!1,console.log(e.body),t.exportMsg="Export Playlist.","well shit"!==e.body?t.data.playlistURL=e.body.external_urls.spotify:t.exportMsg="Something went wrong! Try again."},function(e){t.loading=!1,console.log(e)})}}},p={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"generate-song"},[a("p",{attrs:{id:"msg"}},[t._v(t._s(t.msg))]),t._v(" "),a("div",{staticClass:"row params"},[a("div",{staticClass:"col-md-4 col-sm-12"},[a("div",{staticClass:"input-generic"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.listLength,expression:"listLength"}],attrs:{id:"listLength",type:"number",number:"",maxlength:"3",min:"0",pattern:"\\d{3}",max:"300"},domProps:{value:t.listLength},on:{input:function(e){e.target.composing||(t.listLength=e.target.value)}}}),t._v(" "),a("label",[t._v("Track"),t.listLength>1?a("label",[t._v("s")]):t._e()])])]),t._v(" "),a("div",{staticClass:"col-md-4 col-sm-12"},[a("div",{staticClass:"input-generic"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.bpm,expression:"bpm"}],attrs:{name:"bpm",id:"bpm",type:"number",number:"",maxlength:"3",min:"0",pattern:"\\d{3}",max:"300"},domProps:{value:t.bpm},on:{input:function(e){e.target.composing||(t.bpm=e.target.value)}}}),t._v(" "),a("label",{attrs:{for:"bpm"}},[t._v("BPM   ")])])]),t._v(" "),a("div",{staticClass:"col-md-4 col-sm-12"},[a("div",{staticClass:"input-generic"},[a("h2",[t._v(t._s(t.genre)),a("label",{attrs:{for:"bpm"}},[t._v(" Genre   ")])]),t._v(" "),a("p",[t._v("New features coming soon!")])])])]),t._v(" "),a("nav",{staticClass:"cl-effect-18 get-tracklist"},[a("a",{on:{click:t.getTrackList}},[t._v(" "+t._s(t.generateMsg)+" ")])])]),t._v(" "),a("div",{staticClass:"section"},[0!=t.data.trackList.length?a("table",{attrs:{id:"song-feat"}},[t._m(0),t._v(" "),t._l(t.data.trackList,function(e){return a("tr",[a("td",[t._v(t._s(e.name))]),t._v(" "),a("td",[t._v(t._s(e.artists.map(function(t){return t.name}).toString()))]),t._v(" "),a("td",{staticClass:"no-display-mobile"},[t._v(t._s(e.analysis.tempo))]),t._v(" "),a("td",[a("a",{attrs:{target:"_blank",href:e.external_urls.spotify}},[t._v("Get the Track")])])])})],2):t._e()]),t._v(" "),0!=t.data.trackList.length?a("nav",{staticClass:"cl-effect-18 create-playlist"},[null===t.data.playlistURL?a("a",{on:{click:t.createPlaylist}},[t._v(" "+t._s(t.exportMsg))]):t._e(),t._v(" "),null!==t.data.playlistURL?a("a",{attrs:{href:t.data.playlistURL,target:"_blank"}},[t._v("Here's your playlist!")]):t._e()]):t._e(),t._v(" "),t.loading?a("loading-screen"):t._e()],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("tr",[e("th",[this._v("Name")]),this._v(" "),e("th",[this._v("Artist")]),this._v(" "),e("th",{staticClass:"no-display-mobile"},[this._v("Tempo")]),this._v(" "),e("th",[this._v("Source")])])}]};var v=a("VU/8")(g,p,!1,function(t){a("dQfx")},"data-v-000d8769",null).exports,u=a("8+8L");s.a.use(u.a),s.a.use(d.a);var m=new d.a({routes:[{path:"/",name:"Main",component:v}]});s.a.config.productionTip=!1,new s.a({el:"#app",router:m,components:{App:c},template:"<App/>"})},TmX0:function(t,e){},dQfx:function(t,e){},jZEs:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.037756b0c985d596fabb.js.map