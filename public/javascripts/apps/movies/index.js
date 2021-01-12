import MovieModel from './models/movie-model';
import MovieCollection from './collections/movie-collection';
import MovieList from './controllers/list';
import MovieViewer from './controllers/viewer';
import MovieEditor from './controllers/editor';
import Dashboard from './controllers/dashboard';
import isFunction from 'lodash/isFunction';
import bind from 'lodash/bind';

var currCtrl, selectedPage;

function controller( region, Controller ) {
  /* if the controller we want to lanch is
     the same controller we previously
     lanched call it. */
  if ( currCtrl && Controller.isPrototypeOf( currCtrl ) ) {
    return currCtrl;
  }

  if ( currCtrl && isFunction( currCtrl.destroy ) ) {
    currCtrl.destroy();
  }

  currCtrl = Controller.setup({ region });

  return currCtrl;
}

module.exports = {
  setup: function ( options ) {
    const app = Object.create( this );

    Object.assign(app, options);

    app.lanch = bind(controller, null, options.region);

    return app;
  },
  viewList: function ( page ) {
    const
      success = collection => {
        const list = this.lanch( MovieList );

        selectedPage = page;

        list.view(collection, page);
        console.log('Successfully fetch data from the server!');
      },
      error = () => {
        console.log('Cannot fetch data from the server!');
      };

    (new MovieCollection({ page })).fetch({ success, error });
  },
  viewMovie: function ( id ) {
    const
      success = model => {
        const viewer = this.lanch( MovieViewer );

        viewer.view(model, selectedPage);
        console.log('Successfully fetch data from the server!');
      },
      error = () => {
        console.log('Cannot fetch data from the server!');
      };

    (new MovieModel({_id: id})).fetch({success, error});
  },
  createMovie: function () {
    const
      model = new MovieModel(),
      editor = this.lanch( MovieEditor );

    editor.view( model );
  },
  editMovie: function ( id ) {
    const model = new MovieModel({_id: id});

    model.fetch({
      success: model => {
        const editor = this.lanch( MovieEditor );

        editor.view( model );
      },
      error: err => {
        console.log('Failed to fetch data from the server [editMovie]');
      }
    });
  },
  viewDashboard: function (page) {
    const movieCollection = new MovieCollection({ page });

    movieCollection.fetch({
      success: collection => {
        const list = this.lanch( Dashboard );

        list.view( collection );
      },
      error: function () {
        console.log('Cannot fetch data from the server!');
      }
    });
  }
};