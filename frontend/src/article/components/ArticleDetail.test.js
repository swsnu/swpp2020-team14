import React from 'react';
import axios from 'axios';
import { shallow } from 'enzyme';

import ArticleDetail from './ArticleDetail';

jest.mock('axios');
jest.spyOn(window, 'alert');

describe('ArticleDetail', () => {
  const aid = 3;
  const ArticleDetailInner = ArticleDetail.WrappedComponent;
  const mock_history = { push: jest.fn(), goBack: jest.fn() };
  const mocked_article = {
    id: aid, title: "title 01", author: "author 01",
    created_at: "d1", last_edited_at: "d2",
    image_url: "http://example.com/tmp.png", content: "content",
    is_liked: false, like_count: 3, is_owner: false
  };
  const mocked_comments = [3, 1, 4];

  afterEach(() => jest.clearAllMocks());

  it('should display loading message when not loaded', () => {
    // Since disableLifecycleMethods: true (globally),
    //   axios.get() will not be called, and
    //   the component will show loading message.
    const comp = shallow(<ArticleDetailInner article_id={aid} />);

    const msg = comp.find('p');
    expect(msg.length).toBe(1);
  });

  it('should attempt to fetch article', (done) => {
    axios.get.mockImplementationOnce((url) => new Promise((resv, rej) => {
      expect(url).toEqual(`/api/article/${aid}`);
      rej(); done();
    }));

    shallow(<ArticleDetailInner article_id={ aid } history={ mock_history }/>,
      { disableLifecycleMethods: false });
  });

  it('should attempt to fetch comments', (done) => {
    axios.get.mockResolvedValueOnce({ data: { article: {} } })
      .mockImplementationOnce((url) => new Promise((resv, rej) => {
        expect(url).toEqual(`/api/article/${aid}/comment`);
        rej(); done();
    }));

    shallow(<ArticleDetailInner article_id={ aid } history={ mock_history }/>,
      { disableLifecycleMethods: false });
  });

  describe('with mock data', () => {
    let comp;

    beforeAll(async () => {
      axios.get.mockResolvedValueOnce({ data: { article: mocked_article }})
        .mockResolvedValueOnce({ data: { comments: mocked_comments }});
      comp = shallow(<ArticleDetailInner article_id={ aid } history={ mock_history }/>, 
        { disableLifecycleMethods: false });
      while (comp.first().type() === "p") {
        await new Promise(resv => setTimeout(resv, 100));
      }
    });

    it('should display all required items', () => {
      for (const className of ["title", "content", "author", "create", "last-edit",
        "image", "like-cnt"]) {
        expect(comp.find(`.${className}`).length).toBe(1);
      }
      expect(comp.find("CommentList").length).toBe(1);
    });

    it('should not show control buttons for non-owner', () => {
      expect(comp.find(".control-buttons").length).toBe(0);
    });

    it('should display comments', () => {
      const cmt_list = comp.find('CommentList');
      expect(cmt_list.prop("comments")).toEqual(mocked_comments);
    });

    it('should have working Like button', () => {
      const btn = comp.find('.likes button.not-liked');
      expect(btn.length).toBe(1);
      axios.post.mockRejectedValueOnce();
      btn.simulate("click");
      axios.post.mockResolvedValueOnce({ data: { success: false, error: "" }});
      btn.simulate("click");
      axios.post.mockResolvedValueOnce({ data: { success: true }});
      btn.simulate("click");
    });

    it('should have proper Like number text (pl.)', () => {
      const txt = comp.find('.likes .like-cnt');
      expect(txt.text()).toEqual(expect.stringContaining("Likes"));
    });

    it('should delegate to CommentList properly', (done) => {
      const lst = comp.find('CommentList');
      const onDelete = lst.prop('onDelete');

      axios.delete.mockRejectedValueOnce("error");
      onDelete(3);
      axios.delete.mockResolvedValueOnce({ data: { success: false, error: "error" }});
      onDelete(3);

      const onSubmit = lst.prop('onSubmit');

      axios.post.mockRejectedValueOnce("error");
      onSubmit(-1, "new content");
      axios.post.mockResolvedValueOnce({ data: { success: false, error: "error" }});
      onSubmit(-1, "new content");

      axios.put.mockRejectedValueOnce("error");
      onSubmit(5, "edit content");
      axios.put.mockResolvedValueOnce({ data: { success: false, error: "error" }});
      onSubmit(5, "edit content");

      axios.put.mockResolvedValueOnce({ data: { success: true }});
      axios.get.mockImplementationOnce((url) => {
        expect(url).toEqual(`/api/article/${aid}/comment`);
        done();
        return new Promise((resv, rej) => rej());
      });
      onSubmit(5, "edit content");
    });
  });

  describe('with mock data for each', () => {
    let comp;

    const loadArticle = async (delta) => {
      axios.get.mockResolvedValueOnce({ data: { article: { ...mocked_article, ...delta }}})
        .mockResolvedValueOnce({ data: { comments: mocked_comments }});
      comp = shallow(<ArticleDetailInner article_id={ aid } history={ mock_history }/>, 
        { disableLifecycleMethods: false });
      while (comp.first().type() === "p") {
        await new Promise(resv => setTimeout(resv, 100));
      }
    };

    it('should show control buttons for owner', async () => {
      await loadArticle({ is_owner: true });
      expect(comp.find(".control-buttons").length).toBe(1);
      expect(comp.find(".control-buttons button").length).toBe(2);
    });

    it('should have working edit button', async () => {
      await loadArticle({ is_owner: true });
      const btn = comp.find(".control-buttons button.edit");
      btn.simulate("click");
      expect(mock_history.push).lastCalledWith(`/article/${aid}/edit`);
    });

    it('should have working delete button', async () => {
      await loadArticle({ is_owner: true });
      const btn = comp.find(".control-buttons button.delete");
      // simulate delete fail
      axios.delete.mockImplementationOnce(() => new Promise((resv, rej) => rej() ));
      btn.simulate("click");

      // simulate delete fail
      axios.delete.mockImplementationOnce(() => new Promise((resv) =>
        resv({ data: { success: false, error: "err str" }})));
      btn.simulate("click");

      // simulate delete success
      axios.delete.mockImplementationOnce(() => new Promise((resv) =>
        resv({ data: { success: true }})));
      btn.simulate("click");
    });

    it('should have working Unlike button', async () => {
      await loadArticle({ is_liked: true });
      const btn = comp.find('.likes button.liked');
      expect(btn.length).toBe(1);
      axios.delete.mockRejectedValueOnce();
      btn.simulate("click");
      axios.delete.mockResolvedValueOnce({ data: { success: false, error: "" }});
      btn.simulate("click");
      axios.delete.mockResolvedValueOnce({ data: { success: true }});
      btn.simulate("click");
    });
  
    it('should have proper Like number text (sg.)', async () => {
      await loadArticle({ like_count: 1 });
      const txt = comp.find('.likes .like-cnt');
      expect(txt.text()).toEqual(expect.not.stringContaining("Likes"));
    });
  });
});
