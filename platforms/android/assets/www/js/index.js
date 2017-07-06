/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var analyticsConfig = require('./app/analyticsConfig');

module.exports = (function () {
		document.addEventListener('deviceready', appReady, false);

		function appReady() {
			// this setTimeout is to allow a developer six seconds
			// to connect a debugger before the app initializes
			// should be commented out for release, but uncomment appInit()
			//setTimeout(function () {
				appInit();
			//}, 6000)
		}

		function startApp () {
			require('./app/history');
			require('./init');
		}

		function appInit () {
			$(function () {
				if (analyticsConfig.track && analytics) {
					analytics.startTrackerWithId(analyticsConfig.trackId);
					analytics.trackEvent('Init', 'Load', 'App Started', 10);
				}

				startApp();
			});
		}
}());
