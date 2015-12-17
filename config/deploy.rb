set :application, 'click_lion_help_center'
set :repo_url, 'git@github.com:247DigitalGroup/click_lion_help_center.git'
set :user, 'ubuntu'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/home/#{fetch(:user)}/apps/#{fetch(:application)}"

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')

# Default value for linked_dirs is []
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

namespace :deploy do
  desc "Compile the repository"
  task :compile do
    on roles(:app) do
      within release_path do
        execute :npm, :install
        execute :bower, :install
        execute :gulp, :compile
      end
    end
  end
  after :updated, :compile

  desc "Upload nginx configuration"
  task :nginx_config do
    on roles(:web) do
      sudo :ln, '-fs', "#{current_path}/click_lion_help_center", "/etc/nginx/sites-enabled/help_center"
      sudo 'service nginx reload'
    end
  end
end
