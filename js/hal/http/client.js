HAL.Http.Client = function(opts) {
  this.vent = opts.vent;
  this.defaultHeaders = { 'Accept': 'application/hal+json, application/json, */*; q=0.01' };
  this.headers = this.defaultHeaders;
};

HAL.Http.Client.prototype.get = function(url) {
  var self = this;
  var hal = "hal";
  var uri = new URI(url);
  if (!uri.hasSearch(hal)) {
    url = uri.addSearch(hal, "f");
  }
  this.vent.trigger('location-change', { url: url });
  var jqxhr = $.ajax({
    url: url,
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    headers: this.headers,
    success: function(resource, textStatus, jqXHR) {
      self.vent.trigger('response', {
        resource: resource,
        jqxhr: jqXHR,
        headers: jqXHR.getAllResponseHeaders()
      });
    }
  }).error(function() {
    self.vent.trigger('fail-response', { jqxhr: jqxhr });
  });
};

HAL.Http.Client.prototype.request = function(opts) {
  var self = this;
  opts.dataType = 'json';
  opts.xhrFields = opts.xhrFields || {};
  opts.xhrFields.withCredentials = opts.xhrFields.withCredentials || true;
  self.vent.trigger('location-change', { url: opts.url });
  return jqxhr = $.ajax(opts);
};

HAL.Http.Client.prototype.updateHeaders = function(headers) {
  this.headers = headers;
};

HAL.Http.Client.prototype.getHeaders = function() {
  return this.headers;
};
