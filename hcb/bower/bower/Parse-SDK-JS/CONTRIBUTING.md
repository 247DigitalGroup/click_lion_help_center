# Contributing to the Parse JavaScript SDK
We want to make contributing to this project as easy and transparent as possible.

If you're looking to get started, but want to ease yourself into the codebase, look for issues tagged [good first bug](https://github.com/ParsePlatform/Parse-SDK-JS/labels/good%20first%20bug). These are simple yet valuable tasks that should be easy to get started.

## Code of Conduct
Facebook has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](https://code.facebook.com/codeofconduct) so that you can understand what actions will and will not be tolerated.

## Our Development Process
Most of our work will be done in public directly on GitHub. There may be changes done through our internal source control, but it will be rare and only as needed.

### `master` is unsafe
Our goal is to keep `master` stable, but there may be changes that your application may not be compatible with. We'll do our best to publicize any breaking changes, but try to use our specific releases in any production environment.

### Pull Requests
We actively welcome your pull requests. When we get one, we'll run some Parse-specific integration tests on it first. From here, we'll need to get a core member to sign off on the changes and then merge the pull request. For API changes we may need to fix internal uses, which could cause some delay. We'll do our best to provide updates and feedback throughout the process.

1. Fork the repo and create your branch from `master`.
2. Add unit tests for any new code you add.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. If you haven't already, complete the Contributor License Agreement ("CLA").

### Contributor License Agreement ("CLA")
In order to accept your pull request, we need you to submit a CLA. You only need to do this once to work on any of Facebook's open source projects.

Complete your CLA here: <https://developers.facebook.com/opensource/cla>


## Bugs
Although we try to keep developing on Parse easy, you still may run into some issues. General questions should be asked on [Google Groups][google-group], technical questions should be asked on [Stack Overflow][stack-overflow], and for everything else we'll be using GitHub issues.

### Known Issues
We use GitHub issues to track public bugs. We will keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new issue, try to make sure your problem doesn't already exist.

### Reporting New Issues
Not all issues are SDK issues. If you're unsure whether your bug is with the SDK or backend, you can test to see if it reproduces with our [REST API][rest-api] and [Parse API Console][parse-api-console]. If it does, you can report backend bugs [here][bug-reports].

Details are key. The more information you provide us the easier it'll be for us to debug and the faster you'll receive a fix. Some examples of useful tidbits:

* A description. What did you expect to happen and what actually happened? Why do you think that was wrong?
* A simple unit test that fails. Refer [here][tests-dir] for examples of existing unit tests. See our [README](README.md#usage) for how to run unit tests. You can submit a pull request with your failing unit test so that our CI verifies that the test fails.
* What version does this reproduce on? What version did it last work on?
* [Stacktrace or GTFO][stacktrace-or-gtfo]. In all honesty, full stacktraces with line numbers make a happy developer.
* Anything else you find relevant.

### Security Bugs
Facebook has a [bounty program](https://www.facebook.com/whitehat/) for the safe disclosure of security bugs. In those cases, please go through the process outlined on that page and do not file a public issue.

## Coding Style
* Most importantly, match the existing code style as much as possible.
* We use [Flow](http://flowtype.org/) and ES6 for this codebase. Use modern syntax whenever possible.
* Keep lines within 80 characters.
* Always end lines with semicolons.

## License
By contributing to the Parse JavaScript SDK, you agree that your contributions will be licensed under its license.

 [google-group]: https://groups.google.com/forum/#!forum/parse-developers
 [stack-overflow]: http://stackoverflow.com/tags/parse.com
 [bug-reports]: https://www.parse.com/help#report
 [rest-api]: https://www.parse.com/docs/rest/guide
 [parse-api-console]: http://blog.parse.com/announcements/introducing-the-parse-api-console/
 [stacktrace-or-gtfo]: http://i.imgur.com/jacoj.jpg
 [tests-dir]: /src/__tests__
